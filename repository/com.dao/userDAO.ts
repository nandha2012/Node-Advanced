import { pool } from "../../com.database/db-connectionFactory";
import { UserDTO } from "../../com.dto/userDTO";
import { UserService } from "../../com.service/userService";
import { globalValues } from '../../app'
import { generateToken } from '../../middleware/jwt-auth-route'
import * as bcrypt from 'bcrypt';
import * as cron from 'node-cron';
import Logger from '../../util/logger';
import { ReturnStatus } from "../../util/constants";
import { SendMail, secretkey } from '../../config'
import logger from "../../util/logger";
export default class UserDAO implements UserService {

    public async addUser(userDetails: UserDTO): Promise<number> {
        const saltRounds = 10;
        console.log(userDetails);
        try {
            const hashpassword = await bcrypt.hashSync(userDetails.password, saltRounds);
            const insertQuery = `INSERT INTO users(first_name, last_name,email_id,
                                user_password,mobile,user_img,user_file) VALUES(
                ${pool.escape(userDetails.firstName)},
                ${pool.escape(userDetails.lastName)},
                ${pool.escape(userDetails.emailId)},
                ${pool.escape(hashpassword)},
                ${pool.escape(userDetails.mobile)},
                ${pool.escape(userDetails.userImage)},
                ${pool.escape(userDetails.userFile)})`;
            let list = await pool.query(insertQuery);
            return (list.affectedRows > 0) ? ReturnStatus.ADD_SUCCESS : ReturnStatus.ADD_FAIL
        } catch (err) {
            Logger.error(`addUser-DAO : ${err.stack}`);
            throw err;

        }
    }

    public async addJob(data: any):Promise<number>  {
        try {
            console.log(data);
            var date = new Date(data.date)
            var day = date.getDay();
            console.log(day);
            globalValues.mailQuery = `SELECT 
                                        * 
                                    FROM 
                                        users 
                                    WHERE 
                                        priority = '${globalValues.priority[globalValues.priority_count]}' AND 
                                        job_type = '${data.jobType}' AND
                                        day_${day} = 'AVAIL'`
            let list = await pool.query(globalValues.mailQuery);
            let sendmail = new SendMail();
            let statusQuery: any, status: any;
            globalValues.CronJob = new cron.schedule(`0-59/1  *  * * * `, async () => {
               
                if (list[globalValues.list_count + 1]) {
                    globalValues.nextUser = list[globalValues.list_count +1].id
                    console.log(`next User : ${globalValues.nextUser}`);
                } else {
                    globalValues.nextUser = null;
                }

                if (list[globalValues.list_count]) {
                    globalValues.token = generateToken()
                    await sendmail.mailFromNodeMailer(list[globalValues.list_count].email_id,
                        list[globalValues.list_count].first_name,
                        list[globalValues.list_count].id, day)
                    console.log(globalValues.list_count);
                    console.log(`${list[globalValues.list_count].id} | ${list[globalValues.list_count].priority} | ${list[globalValues.list_count].job_type} | ${list[globalValues.list_count].first_name} - ${list[globalValues.list_count].email_id}`);     
                    const updateQuery = `UPDATE users SET new_token='${globalValues.token}' 
                                    WHERE id = ${list[globalValues.list_count].id}`
                    await pool.query(updateQuery);
                    globalValues.list_count++;
                }

                if (!(globalValues.priority[globalValues.priority_count + 1]) && !(list[globalValues.list_count])) {
                    console.log(`inside Destroy`);
                    globalValues.CronJob.destroy();
                    globalValues.list_count = 0;
                    globalValues.priority_count = 0;
                    return
                }

                if (!list[globalValues.list_count] && globalValues.priority_count < globalValues.priority.length) {

                    globalValues.priority_count++;

                    globalValues.mailQuery = `  SELECT 
                                                    * 
                                                FROM 
                                                    users 
                                                WHERE 
                                                    priority = '${globalValues.priority[globalValues.priority_count]}' AND
                                                    job_type = '${data.jobType}' AND 
                                                    day_${day} = 'AVAIL';`
                    list = await pool.query(globalValues.mailQuery);
                    globalValues.list_count = 0;
                }
                
            });
            return (list.length > 0 && globalValues.CronJob) ? ReturnStatus.ADD_SUCCESS : ReturnStatus.ADD_FAIL
        } catch (err) {
            logger.error(`addJob-DAO: ${err.stack}`);
            throw err;
        }
    }
    public async getJobList() {
        try {
            const jobListQuery = `SELECT DISTINCT job_type FROM users`
            let list = await pool.query(jobListQuery);
            console.log(list);
            return list;

        } catch (err) {
            logger.error(`getJobList-DAO: ${err.stack}`);
            throw err;
        }
    }

}