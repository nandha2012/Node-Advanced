import * as express from 'express';
import { UserRoutes } from './routes/userRoutes';
import  jobControl  from './com.controller/JobController';
import { backup_Db } from './repository/com.job/jobs';
import * as cron from 'node-cron';
import * as bodyParser from 'body-parser';
import path = require('path');
export var globalValues = {
    "token" : "",
    "users": [],
    "list_count":0,
    "nextUser":null,
    "CronJob":null,
    "priority_count":0,
    "mailQuery":"",
    "priority" :["High", "Medium", "Low"]
}   
export default class App {

    public app: express.Application;
    public routesprev: UserRoutes = new UserRoutes();
    public cronJob = new jobControl; 
    private config(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Expose-Headers", "x-total-count");
            res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
            res.header("Access-Control-Allow-Headers", "Content-Type,authorization");
            next();
        });
    }
    constructor() {
        this.app = express();
        this.config();
        this.routesprev.UserRoutes(this.app);
        //this.cronJob.jobControl(backup_Db,1);
    }

}
