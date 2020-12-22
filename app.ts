
import * as express from 'express';
import {UserRoutes} from './routes/userRoutes';

import * as bodyParser from 'body-parser';

// import * as swaggerJsDoc from 'swagger-jsdoc';
// import * as swaggerUi from 'swagger-ui-express';

// // Extended: https://swagger.io/specification/#infoObject
// const swaggerOptions = {
//     swaggerDefinition: {
//       info: {
//         version: "1.0.0",
//         title: "Customer API",
//         description: "Customer API Information",
//         contact: {
//           name: "Amazing Developer"
//         },
//         servers: ["http://localhost:5000"]
//       }
//     },
//     // ['.routes/*.js']
//     apis: ["app.js"]
//   };
  
export default class App{
    
    public app:express.Application;
    public routesprev:UserRoutes = new UserRoutes();
     
    private config():void{
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended:false}));
    }

    constructor(){
        this.app = express();
        this.config();
        this.routesprev.UserRoutes(this.app);

 }  

}