const express = require('express');
const router = express.Router();
const axios       = require('axios');

const passport = require('passport')

// User models
const User = require('./../models/user');
/* const Book = require('../models/book');
const Bookshelf = require('../models/bookshelf'); */

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const loggedInUser = require('../helpers/middlewares').loggedInUser

const nodemailer = require('nodemailer')

// SMTP 
let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});



router.get('/auth/signup', (req, res, next) => {
  res.render('private/signup');
});


// POST /signup
router.post('/auth/signup', (req, res, next) => {

  const email = req.body.email
  const password = req.body.password

  // creates a 4 digit random token
  const tokenArr = Array.from({
    length: 4
  }, () => Math.floor(Math.random() * 10)) // [ 1, 4, 5, 8 ]
  const token = tokenArr.join(''); // "1458"

  transporter.sendMail({
      from: '"Mein Manga Regal" <mail@my-manga-library.de>',
      to: email,
      subject: 'Deine Registrierung bei "Mein Manga Regal"',
      text: `Bitte bestätige deine Emailadresse, in dem du auf dem Link klickst: ${process.env.VERIFYEMAIL}${token}`,
      html: `Bitte bestätige deine Emailadresse, in dem du auf dem Link klickst: ${process.env.VERIFYEMAIL}${token}`
      // aternatively, send the token itself for the user to type it
      // text: `Hey this is your token `${token}`,
      // html: `Hey this is your token `${token}`,
    })
    .then(() => {
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(req.body.password, salt);

      let user = new User({
        email: req.body.email,
        password: hashPass,
        token: token
      })
      return user.save()

    }).then((theUser) => {
      req.login(theUser, () => {
        res.redirect('/')
      }) // theUser now has an _id because we stored it into the database
    })
})


router.get('/verify-email-link/:token', (req, res) => {
  if (req.user.token === req.params.token) {
    req.user.verifiedEmail = true
    req.user.save().then(() => {
      // more professional : res.redirect and set a flash message before
      res.send('Deine Emailadresse wurde erfolgreich bestätigt')
    })
  }
})

router.get('/verify-email', (req, res) => {
  res.render('private/verify')
})

router.post('/verify-email', (req, res) => {
  console.log(req.user)
  if (req.user.token === req.body.token) {
    req.user.verifiedEmail = true
    req.user.save().then(() => {
      // more professional : res.redirect and set a flash message before
      res.send('Deine Email wurde erfolgreich bestätigt')
    })
  }
})

router.get('/auth/login', (req, res) => {
  //console.log(req.flash('error'))

  // req.flash('message') // <= this is always an array

  // redirect to homepage if already logged in
  if (req.user) {
    res.redirect('/')
  }

  res.render('private/login', {
    errorArr: req.flash('message')
  })
})

// use LocalStrategy for authentication
router.post('/auth/login', passport.authenticate('local', {
  successRedirect: '/', // pick up the redirectBackTo parameter and after login redirect the user there. ( default / )
  failureRedirect: '/auth/login',
  failureFlash: true,
  // passReqToCallback: true
}))

//////////////// SLACK login ////////////////////////////////

router.get("/auth/slack", passport.authenticate("slack"));

router.get(
  "/auth/slack/callback",
  passport.authenticate("slack", {
    successRedirect: "/userlibrary", // for deploy on heroku change the link on slack page to https://my-manga-library.herokuapp.com/auth/slack/callback
    failureRedirect: "/auth/login" 
  })
);

//////// SLACK login END ////////////////////////////////


//////// LOGOUT /////////
router.get('/auth/logout', (req, res) => {
  req.logout() // this one deletes the user from the session
  res.render('private/logout');
  //.then(() => {res.redirect('/')}) //timeout?
})


module.exports = router;