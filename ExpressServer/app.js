//Generelle Anforderungen
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Express-Routen anfordern
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var addRouter = require('./routes/add');
var adduserRouter = require('./routes/add_user');
var getRouter = require('./routes/get_memes');
var backgroundRouter = require('./routes/get_backgrounds');
var getusersRouter  = require('./routes/get_users');
var addlike  = require('./routes/add_like');
var delMemeRouter  = require('./routes/delete_meme');
var adddislike  = require('./routes/add_dislike');
var createMeme = require('./routes/create_meme');

//Mongoose als Brcke zur MongoDB Datenbank initialisieren
const mongoose = require('mongoose');
const { ADDRCONFIG } = require('dns');

var app = express();

//connect to mongodb
var dbURI = "mongodb+srv://Schepi:OMM2020@cluster0.bwnrd.mongodb.net/memes?retryWrites=true&w=majority";
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => console.log("Connected to db"))
    .catch((err) => console.log(err));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Header für Access-Control setzen
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
});



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Routen verlinken
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/add', addRouter);
app.use('/add_user', adduserRouter);
app.use('/get_users', getusersRouter);
app.use('/get_memes', getRouter);
app.use('/get_backgrounds', backgroundRouter);
app.use('/add_like', addlike);
app.use('/delete_meme', delMemeRouter);
app.use('/add_dislike', adddislike);
app.use('/create_meme', createMeme);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
