const express = require('express');
const router = express.Router();

const loggedInUser = require('../helpers/middlewares').loggedInUser


const axios = require('axios')


/* GET home page */
router.get('/', (req, res) => {

  // req.user // passport makes this available 
  res.render('index', {
    user: req.user
  });

});


// here user needs to be logged in
router.get('/books', loggedInUser, (req, res) => {

  res.send('here be books')
});


module.exports = router;