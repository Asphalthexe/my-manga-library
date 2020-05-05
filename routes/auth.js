const express = require('express');
const router = express.Router();

const passport = require('passport')

// User model
const User = require('../models/user');

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const loggedInUser = require('../helpers/middlewares').loggedInUser
const userIsAdmin = require('../helpers/middlewares').userIsAdmin

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});



// logout
router.get('/logout', (req, res) => {
  req.logout() // this one deletes the user from the session
  res.render('auth/logout');
})


module.exports = router;
