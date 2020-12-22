import * as nodemailer from "nodemailer";
export  let statusCode =  {
    success : 200,
    badRequest : 400,
    internalServerError : 500
}
export const environment = process.env.NODE_ENV;
export const port = process.env.PORT;
export const logDirectory = process.env.LOG_DIR;
export const secretkey = process.env.WEB_TOKEN_KEY;
export const imageDirectory = process.env.IMG_DIR;

export class sendMail {
public async mailFromNodeMailer(toMailId:string,userName : string){
    try{
        console.log('Email: '+toMailId +'userName : '+userName);
        let transporter = await nodemailer.createTransport({
            host:  'smtp.gmail.com',
            port:  587,
            secure: false,
            auth: {
              user: 'nandhakumar270@gmail.com',
              pass: 'ibtbab@login'
            }
          });
          let mailConfig = {

            from: 'nandhakumar270@gmail.com',
            to:  `${toMailId}`,
            subject: `Hi Welcome to node`,
            text: "Hello world?",
            html: `Dear ${userName}`
          };

        await transporter.sendMail(mailConfig);
        return true;
        
    }catch(err){
        throw err;
    }    
} 
}