import { UserDTO } from '../com.dto/userDTO';
import { Request, Response } from 'express';
import UserDAO from '../repository/com.dao/userDAO';
import { ReturnStatus } from '../util/constants';
import { statusCode } from '../config'

import Logger from '../util/logger';

interface multerRequest extends Request{
    files: any;
}
export default class UserController {
    public async addUser(req:multerRequest, res: Response) {
        var data = JSON.parse(req.body.data);
        
        try {
            let userDTO = new UserDTO();
            if(req.files) {
                userDTO.userImage = `${req.files.userImage[0].destination}${req.files.userImage[0].filename}`;
                userDTO.userFile = `${req.files.userFile[0].destination}${req.files.userFile[0].filename}`;
            } else{
                userDTO.userImage = '';
                userDTO.userFile ='';
            }
            userDTO.firstName = data.firstName;
            userDTO.lastName = data.lastName;
            userDTO.emailId = data.emailId;
            userDTO.password = data.password;
            userDTO.mobile = data.mobile;
            console.log(userDTO);
            let userDAO = new UserDAO();
            let addUser = await userDAO.addUser(userDTO);
            if (addUser === ReturnStatus.ADD_SUCCESS) {
                res.status(statusCode.success).json({ message: 'sucessfully added' });
            } else {
                res.status(statusCode.badRequest).json({ message: 'Add request failed ' });

            }
        } catch (err) {
            Logger.error(`error-addUser: ${err.stack}`);
            console.log('error-addUser:' + err.stack);
            res.status(statusCode.internalServerError).json({ messege: 'Internal server Error' });
        }
    }

   
}