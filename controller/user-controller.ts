import { Request, Response } from 'express';
import * as jwtToken from 'jsonwebtoken';
import { statusCode,sendMail} from '../config'
import * as bcrypt from 'bcrypt';
import Logger from '../util/logger';
import { pool } from '../db/db-connection';


interface multerRequest extends Request{
    file: any;
}

export default class UserContoller {
    
   

    public async getUserList(req:Request, res: Response) {
        try {

            const getUserListQuery = `SELECT * FROM users`;
            let list = await pool.query(getUserListQuery);
            res.status(statusCode.success).json({ data: (list.length) > 0 ? list : [] });
        } catch (err) {
            Logger.error(`getUserList : ${err.stack}`);
            res.status(statusCode.internalServerError).json({ message: "Internal Server Error" });
        }
    }

    public async addUser(req:multerRequest, res: Response){
        const saltRounds = 10;
        //console.log(secretkey);
        const token = jwtToken.sign({ name: 'nandha' }, 'login');

        let decoded = await jwtToken.decode(token.toString());

        if(req.file) {
            req.body.userImage = `/${req.file.destination}${req.file.filename}`;
        } else{
            req.body.userImage = '';
        }

        try {
            const hashpassword = await bcrypt.hashSync(req.body.password, saltRounds);
            const insertQuery = `INSERT INTO users(first_name, last_name,email_id,password,address) VALUES(
                                ${pool.escape(req.body.firstName)},
                                ${pool.escape(req.body.lastName)},
                                ${pool.escape(req.body.emailId)},
                                ${pool.escape(hashpassword)},
                                ${pool.escape(req.body.address)})`;

            let list = await pool.query(insertQuery);
            if (list.affectedRows > 0) {
                let userName =  req.body.firstName+ ' '+req.body.lastName; 

                let sendmail = new sendMail();
                 await sendmail.mailFromNodeMailer(req.body.emailId,userName);
                res.status(statusCode.success).json({ message: 'sucessfully added' });
                
            }
            else {
                res.status(statusCode.badRequest).json({ message: 'Add request failed ' });
            }
        } catch (err) {
            Logger.error(`addUser : ${err.stack}`);
            console.log('error:'+err.stack);
            res.status(statusCode.internalServerError).json({ messege: 'Internal server Error' });
        }
    }
    public async deleteUser(req: Request, res: Response) {
        try {

            const deleteUserQuery = `DELETE FROM users WHERE id =${pool.escape(req.params.userId)};`;
            let list = await pool.query(deleteUserQuery);
            if (list.affectedRows > 0) {
                res.status(statusCode.success).json({ message: 'sucessfully Deleted user.' });
            }
            else {
                res.status(statusCode.badRequest).json({ message: 'Delete request failed' });
            }

        } catch (err) {
            Logger.error(`deleteUser : ${err.stack}`);
            res.status(statusCode.internalServerError).json({ message: "Internal Server Error...!" });
        }
    }
    public async getUserById(req: Request, res: Response) {
        try {
            const getUserQuery = `SELECT * FROM users WHERE id = ${pool.escape(req.params.userId)};`;
            let list = await pool.query(getUserQuery);
            if (list.length > 0) {
                res.status(statusCode.success).json({ data: list });
            }
            else {
                res.status(statusCode.badRequest).json({ message: 'unable to get user...!' });
            }
        }
        catch (err) {
            Logger.error(`getUserById : ${err.stack}`);
            res.status(statusCode.internalServerError).json({ message: "Internal Server Error...!" });
        }
    }
    public async updateUser(req: Request, res: Response) {
        try {
            const updateQuery = `UPDATE users SET first_name = ${pool.escape(req.body.firstName)},
            last_name = ${pool.escape(req.body.lastName)},
            address = ${pool.escape(req.body.address)} WHERE id = ${pool.escape(req.body.id)}`;
            console.log(updateQuery);

            let list = await pool.query(updateQuery);
            if (list.affectedRows > 0) {
                res.status(statusCode.success).json({ message: 'Sucessfully Updated...!' });
            }
            else {
                res.status(statusCode.badRequest).json({ message: 'unable to update user...!' });
            }
        }
        catch (err) {
            Logger.error(`updateUser : ${err.stack}`);
            res.status(statusCode.internalServerError).json({ message: "Internal Server Error...!" });
        }
    }
}