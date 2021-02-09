import createError from  'http-errors';
import express from 'express';
import path from 'path';
import logger from 'morgan';
import session from 'express-session';
import MemoryStore from 'memorystore';
import cors from 'cors';


import indexRouter from './routes/index';
import employeesRouter from './src/employees/employee.router';
import claimsRouter from './src/requests/request.router';
import underlingsclaimsRouter from './src/requests/childRequests';
import publicDir from './constant';

import dotenv from 'dotenv';

dotenv.config();

var app = express();

app.use(cors({origin: 'http://localhost:3001', credentials: true}));
//app.use(cors({ origin: process.env.CLIENT, credentials: true }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(publicDir));
//app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'whatever',
  store: new (MemoryStore(session))({checkPeriod: 86400000}),
  cookie: {}
}));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/requests', requestRouter);

app.use('/', indexRouter);
app.use('/employees', employeesRouter);
app.use('/claims', claimsRouter);
app.use('/underlingsclaims', underlingsclaimsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
//app.use(function(err: any, req: any, res: any, next: Function) {
  // set locals, only providing error in development
//  res.locals.message = err.message;
//  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
//  res.status(err.status || 500);
//  res.sendFile('/error.html', {root: publicDir});
  //res.render('error');
//});

module.exports = app;
