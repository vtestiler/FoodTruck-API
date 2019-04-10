import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
const LocalStrategy = require('passport-local').Strategy;

import config from './config';
import routes from './routes';

let app = express();
app.server = http.createServer(app);

// middleware
// parse application/ json
app.use(bodyParser.json({
  limit: config.bodyLimit
})) ;

// passport eslintConfig
app.use(passport.initialize());
let Account = require('./model/account');
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  Account.authenticate()
));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// api routes v1
app.use('/v1', routes);

//app.server.listen('localhost', config.port);
app.server.listen({host: '0.0.0.0', port: config.port}); // If you use localhost, will  not be able to connect
// from outside!!!!

//app.server.listen(config.port);// original

// console.log(`Started on port ${app.server.address().port}`);
console.log(`Started on port ${config.port`);

export default app;
