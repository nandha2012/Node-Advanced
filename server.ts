import App from './app';
let appClass = new App().app;
const port = 5000;

appClass.listen(port,() =>{ console.log('Express server running in port : '+port)});