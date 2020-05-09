const express = require('express');
const router = express.Router();

const loggedInUser = require('../helpers/middlewares').loggedInUser
const Book = require('../models/book')


const axios = require('axios')





//////////////// LOGGED IN USERS ONLY ////////////////
router.get('/', loggedInUser, (req, res) => {
  Book.find({owner:req.user.id}).then((books) => {

    res.render('private/userlibrary.hbs', {books});
  })

});




module.exports = router;