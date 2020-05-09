require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');

const session = require('express-session');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const SlackStrategy = require('passport-slack').Strategy;

const MongoStore = require("connect-mongo")(session);

const User = require('./models/user')


mongoose
  .connect('mongodb://localhost/my-manga-library', {
    useNewUrlParser: true
  })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();


// enables flash messages
const flash = require('connect-flash');
app.use(flash());


// express-session configuration 
app.use(session({
  secret: "abc",
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }, // 1 day
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    resave: true,
    saveUninitialized: false,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

// associate user with a session // store the user into the session
passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

// this happens on every single request (if the user is logged in // if user._id exists in the session)
// it makes the current user available as req.user
passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then(user => {
      callback(null, user);
    })
    .catch(error => {
      callback(error);
    });
});

passport.use(
  new LocalStrategy({
    usernameField: 'email'
  }, (username, password, callback) => {
    User.findOne({
        username
      })
      .then(user => {
        if (!user) {
          return callback(null, false, {
            message: 'Falsche Email'
          });
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return callback(null, false, {
            message: 'Falsches Passwort'
          });
        }
        callback(null, user);
      })
      .catch(error => {
        callback(error);
      });
  })
);


///////////////////////// LOGIN WITH SLACK /////////////////////////////////////////////////////////////////////////////////////
// Slack Strategy
passport.use(new SlackStrategy({
  clientID: process.env.SLACK_ID,
  clientSecret: process.env.SLACK_SECRET
}, (accessToken, refreshToken, profile, done) => {

  console.log("Slack Account Details:", profile);

  // optionally persist profile data
  User.findOne({ slackID: profile.id })
    .then(user => {
      if (user) {
        done(null, user);
        return;
      }

      User.create({ slackID: profile.id })
        .then(newUser => {
          done(null, newUser);
        })
        .catch(err => done(err)); // closes User.create()
    })
    .catch(err => done(err)); // closes User.findOne()
}
));

//////////// SLACK LOGIN END //////////////////////////////////////////////////////////////////////////////////////////////////


// basic passport setup
app.use(passport.initialize());
app.use(passport.session());


// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
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
app.locals.title = 'Meine Manga Bibliothek';




// API Google Books
//https://www.googleapis.com/books/v1/volumes?q=flowers&orderBy=newest&key=yourAPIKey //The following example lists results by published date, newest to oldest:



//////////////////////////// API GOODREADS //////////////////////////////////////////////////////////////////////////////////

/* //API Goodreads
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

  
// GOODREADS Connection for login
var request = require("request");

var options = {
  method: 'POST',
  url: 'https://localhost:3000/api/v2/connections',
  headers: {authorization: 'Bearer YOUR_API_V2_TOKEN_HERE'}, //?
  body: {
    name: 'custom-goodreads',
    strategy: 'oauth1',
    enabled_clients: ['YOUR_ENABLED_CLIENT_ID'], //where to get?
    options: {
      client_id: 'YOUR_GOODREADS_KEY', //in env
      client_secret: 'YOUR_GOODREADS_SECRET', // in env
      requestTokenURL: 'http://www.goodreads.com/oauth/request_token',
      accessTokenURL: 'http://www.goodreads.com/oauth/access_token',
      userAuthorizationURL: 'http://www.goodreads.com/oauth/authorize',
      scripts: {
        fetchUserProfile: 'function(token, tokenSecret, ctx, cb) {var OAuth = new require("oauth").OAuth; var parser = require(\'xml2json\'); var oauth = new OAuth(ctx.requestTokenURL, ctx.accessTokenURL, ctx.client_id, ctx.client_secret, "1.0", null, "HMAC-SHA1"); oauth.get("https://www.goodreads.com/api/auth_user", token, tokenSecret, function(e, xml, r) { console.log(xml); if (e) return cb(e); if (r.statusCode !== 200) return cb(new Error("StatusCode: " + r.statusCode)); try { var jsonResp = JSON.parse(parser.toJson(xml)); var user = jsonResp.GoodreadsResponse.user; cb(null, user); } catch (e) { console.log(e); cb(new UnauthorizedError("[+] fetchUserProfile: Goodreads fetch script failed. Check Webtask logs")); } });}'
      }
    }
  },
  json: true
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});

 */


 ///////////////////////////// ROUTES /////////////////////////////////////////////////////////////////////////////////

// routes
const index = require('./routes/index');
app.use('/', index);

const auth = require('./routes/auth');
app.use('/', auth);

const search = require('./routes/search');
app.use('/search', search);


module.exports = app;