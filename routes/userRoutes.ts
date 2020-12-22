import {Request,Response} from 'express';
import UserController from '../controller/user-controller';
import {JwtAuthRoute} from '../middleware/jwt-auth-route';
import * as fs from 'fs';
import * as path from 'path';
import * as multer from 'multer';
import { environment, imageDirectory } from '../config';

let dir = imageDirectory;
if (!dir) dir = path.resolve('images');

// create directory if it is not present
if (!fs.existsSync(dir)) {
  // Create the directory if it does not exist
  fs.mkdirSync(dir);
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,dir);
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+'-'+file.originalname)
    }
  })
   
  let upload = multer({ storage: storage })
//Routing 
export class UserRoutes {
    public userController:UserController = new UserController;
 
    public UserRoutes(app):void{
            let jwtAuthRoute = new JwtAuthRoute();
           app.route('/').get(jwtAuthRoute.checkAuthReq,this.userController.getUserList);
           app.route('/add').post(upload.single('userImage'),this.userController.addUser);
           app.route('/delete-user/:userId').delete(this.userController.deleteUser);
           app.route('/get-user/:userId').get(this.userController.getUserById);
           app.route('/updateUser').post(this.userController.updateUser);


        }
}