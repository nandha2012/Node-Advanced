import * as nodemailer from "nodemailer";
import { htmlTemp } from "./mail/requestTemplate"
export  let statusCode =  {
    success : 200,
    badRequest : 400,
    internalServerError : 500
}
export const environment = process.env.NODE_ENV;
export const port = process.env.PORT;
export const logDirectory ='/home/bumblebee/my_project/workSpace/node_Session/backend/logs';
export const secretkey = "nandha@2020";
export const imageDirectory ='/home/bumblebee/my_project/workSpace/node_Session/backend/userDocs';

export class SendMail {
public async mailFromNodeMailer(toMailId:string,userName : string, id?:number,day?:number){
    try{
        console.log('Email: '+toMailId +'userName : '+userName +'id:'+id);
        let transporter = await nodemailer.createTransport({
            host:  'smtp.gmail.com',
            port:  587,
            secure: false,
            auth: {
              user: 'nandhakumar270@gmail.com',
              pass: 'strongpassword@login'
            }
          });
          let mailConfig = {

            from: 'nandhakumar270@gmail.com',
            to:  `${toMailId}`,
            subject: `Request Mail`,
            text: `Hello ${userName}`,
            html:htmlTemp(userName,id,day)
          };

        await transporter.sendMail(mailConfig);
        return true;
        
    }catch(err){
        throw err;
    }    
} 
}