require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');


mongoose
  .connect('mongodb://localhost/my-manga-library', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

/* app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
})); */
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';


// API Google Books
const GoogleBooksApi = new GoogleBooksApi({
  key: process.env.API_KEY,
});

// Retrieve an access token
googleBooksApi
  .clientCredentialsGrant()
  .then(data => googleBooksApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

  
//API Goodreads
const GoodreadsApi = require('');

// setting of the goodreads-api
const goodreadsApi = new GoodreadsApi({
  clientKey: process.env.GOODREADS_CLIENT_KEY,
  clientSecret: process.env.GOODREADS_CLIENT_SECRET
});

// Retrieve an access token
goodreadsApi
  .clientCredentialsGrant()
  .then(data => goodreadsApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));


// routes
const index = require('./routes/index');
app.use('/', index);


module.exports = app;
