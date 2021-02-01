import { spawn,exec } from 'child_process';
import * as fs from 'fs';
import * as util from 'util';
import logger from '../../util/logger';
import {imageDirectory} from '../../config';

export const backup_Db =  util.promisify(() => {
    const wstream = fs.createWriteStream('/home/bumblebee/my_project/workSpace/node_Session/backend/db_backup/users.sql');
    const mysqldump = spawn('/opt/lampp/bin/mysqldump',[ '-u', 'root', 'netdb']);
    mysqldump
    .stdout
    .pipe(wstream)
    .on('finish', () => {
      console.log('DB Backup Completed!')
    })
    .on('error', (err) => {
        logger.error(`mysqldump: ${err}`)
        console.error(`mysqldump: ${err}`)
    })
    }
)
 