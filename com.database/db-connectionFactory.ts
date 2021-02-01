import * as mysql from 'mysql';
import * as util from 'util';
 
export var pool = mysql.createPool({
  host:"localhost", 
  user:"root",
  password: '',
  database:"netdb",
});
export const dbPool = {
   query: text => util.promisify(pool.query),
   pool: pool
};

 pool.query = util.promisify(pool.query);
 pool.getConnection = util.promisify(pool.getConnection);
