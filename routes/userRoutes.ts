import UserController from '../com.controller/userController';
import JobControl from '../com.controller/JobController';
import { generateToken } from 'middleware/jwt-auth-route'
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as multer from 'multer';
import { environment, imageDirectory } from '../config';

let dir = imageDirectory;
console.log(`Image Dir:${dir}`);
if (!dir) dir = path.resolve('userDocs');
// create directory if it is not present

if (!fs.existsSync(dir)) {
  // Create the directory if it does not exist
  fs.mkdirSync(dir);
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if(file.fieldname === "userImage"){
      cb(null,`${dir}/images`);
      }
      else{
        cb(null,`${dir}/files`)
      }
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+'-'+file.originalname)
    }
  })
   
  let upload = multer({ storage: storage })
//Routing 
export class UserRoutes {
    public userController:UserController = new UserController;
    public jobControl:JobControl = new JobControl;
    public UserRoutes(app):void{
            app.route('/add').post(upload.fields([
              {name:"userImage",maxCount:1},
              {name:"userFile",maxCount:1}]),this.userController.addUser);
            // app.route('/addJob').post(this.jobControl.addJob);
            app.route(`/accept/data`).get(this.jobControl.acceptJob);
            app.route(`/reject/data`).get(this.jobControl.rejectJob);
            app.route('/assignJob').post(this.jobControl.assignJob);
            app.route('/getJobList').post(this.jobControl.getJobList);
        }
}