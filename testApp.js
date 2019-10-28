var createError = require('http-errors');
var express = require('express');
var path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
var mainRouter = require('./routes/main');
var morgan = require('morgan');
require('dotenv').config();
const app = express();

const Cafes = require('./models/Cafes');
const Category = require('./models/Category');

const port = process.env.PORT || 3001;

mongoose.connect(process.env.TEST_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: false,
  useCreateIndex: true
});
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
  console.log('connected to mongodb server');
});

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.YOUR_SECRET_KEY,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
    resave: false,
    saveUninitialized: true
  })
);

app.use(morgan('dev'));
app.use('/api', mainRouter);

// app.post('/newCafemenu', async function (req, res, next) {
//   const test = await Cafes.findOne({});
//   test.menu.push(req.body.menu[0]);
//   await test.save();
//   res.send({})
// })
// {

// 	"menu" : [{
// 		"name" : "sergeg",
// 		"price":4000,
// 		"category":"5da17722791127279b3ea9f9"
// 	}]
// }

//카페추가
app.post('/newCafemenu', async function(req, res, next) {
  const newCategory = new Cafes(req.body);
  newCategory.save();
  res.send({});
});
// {
// 	"name" : "nkhCafe",
// 	"menu" : [{
// 		"name" : "sergeg",
// 		"price":4000,
// 		"category":"5da17722791127279b3ea9f9"
// 	}]
// }

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log(`server is running on port : ${port}`);
});

module.exports = app;
