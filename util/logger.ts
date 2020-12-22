import * as fs from 'fs';
import * as path from 'path';
import { environment, logDirectory } from '../config';

let dir = logDirectory;
if (!dir) dir = path.resolve('logs');

// create directory if it is not present
if (!fs.existsSync(dir)) {
  // Create the directory if it does not exist
  fs.mkdirSync(dir);
}


  let winston = require('winston');
  require('winston-daily-rotate-file');
 
  let transport = new (winston.transports.DailyRotateFile)({
    filename: dir + '/%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
  });
 
  transport.on('rotate', function(oldFilename, newFilename) {
    // do something fun
  });
 
  export default winston.createLogger({
    transports: [
      transport
    ]
  });
 