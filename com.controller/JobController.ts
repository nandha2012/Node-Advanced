import * as cron from 'node-cron';
import { Request, Response } from 'express';
import { globalValues } from '../app';
import { SendMail, statusCode } from '../config';
import { pool } from '../com.database/db-connectionFactory';
import { generateToken } from '../middleware/jwt-auth-route';
import UserDAO from '../repository/com.dao/userDAO';
import Logger from '../util/logger';
import { UserDTO } from '../com.dto/userDTO';
import { ReturnStatus } from '../util/constants';
export default class JobControl {
    public jobControl(job: any, minutes: number) {
        let CronJob = new cron.schedule(`0-59/${minutes} * * * * `, () => { job() });
    }

    // public async addJob(req: Request, res: Response) {
    //     try {
    //         let userDTO = new UserDTO();
    //         let userDAO = new UserDAO();
    //         let addJob = await userDAO.addJob()
    //         if (addJob === ReturnStatus.ADD_SUCCESS) {
    //             res.status(statusCode.success).json({ message: 'sucessfully Job assigned' });
    //         } else {
    //             res.status(statusCode.badRequest).json({ message: `Job request failed` });
    //         }
    //     } catch (err) {
    //         Logger.error(`error-addJob: ${err.stack}`);
    //         console.log(`error-addJob:${err.stack}`);
    //         res.status(statusCode.internalServerError).json({ messege: 'Internal server Error' });
    //     }
    // }

    public async acceptJob(req: Request, res: Response) {
        if (req.query.token === globalValues.token) {
            console.log("day = "+req.query.day);
            let statusQuery = `UPDATE 
                                    users 
                                SET 
                                    job_status='ACCEPTED', 
                                    job_time = CURRENT_TIMESTAMP,
                                    day_${req.query.day} = 'TAKEN' 
                                WHERE 
                                    id =${req.query.id}`;
            let list = await pool.query(statusQuery);
            console.log(list.affectedRows);
            res.send("job accepted...!!!!");
            globalValues.CronJob.destroy()
        } else {
            res.send("Time Out...!!!")
        }
    }

    public async rejectJob(req: Request, res: Response) {
        globalValues.CronJob.stop();
        if (req.query.token === globalValues.token) {
            console.log("inside Reject");
            let statusQuery = `UPDATE users SET job_status='Rejected', job_time = CURRENT_TIMESTAMP
                                WHERE id = ${req.query.id}`
            await pool.query(statusQuery);
            let sendmail = new SendMail();

            if (globalValues.nextUser !== null) {
                console.log(`next user ID: ${globalValues.nextUser}`)
                globalValues.mailQuery = `SELECT * FROM users WHERE id = '${globalValues.nextUser}';`
                let list = await pool.query(globalValues.mailQuery);
                console.log("next user from reject:");
                console.log(list);
                globalValues.token = generateToken()
                await sendmail.mailFromNodeMailer(list[0].email_id, list[0].first_name, list[0].id)
                globalValues.list_count++;
                globalValues.CronJob.start();
            }
            res.send("job Rejected...!!!!")
        } else {
            res.send("Time Out...!!!")
        }
    }

    public async getJobList(req: Request, res: Response) {
        try {
            let userDAO = new UserDAO();
            let getJobList = await userDAO.getJobList()
            if (getJobList.length !== 0) {
                res.status(statusCode.success).json({ message: 'Fetch Sucess...!', data: getJobList });
            } else {
                res.status(statusCode.badRequest).json({ messege: 'Internal server Error' })
            }
        } catch (err) {
            Logger.error(`error-getJobList: ${err.stack}`);
            console.log(`error-getJobList:${err.stack}`);
            res.status(statusCode.internalServerError).json({ messege: 'Internal server Error' });
        }
    }
    public async assignJob(req: Request, res: Response): Promise<void> {
        try {
            let data = req.body
            let userDAO = new UserDAO();
            let addJob = await userDAO.addJob(data);
            if (addJob === ReturnStatus.ADD_SUCCESS) {
                res.status(statusCode.success).json({ message: 'sucessfully Job assigned' });
            } else {
                res.status(statusCode.badRequest).json({ message: `Job request failed` });
            }
        } catch (err) {
            Logger.error(`error-assignJob: ${err.stack}`);
            console.log(`error-getJobList:${err.stack}`);
            res.status(statusCode.internalServerError).json({ messege: 'Internal server Error' });
        }
    }
}