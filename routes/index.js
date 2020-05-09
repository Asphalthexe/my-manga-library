const express = require('express');
const router = express.Router();

const loggedInUser = require('../helpers/middlewares').loggedInUser


const axios = require('axios')


/* GET home page */
router.get('/', (req, res) => {

  console.log(req.user)

  // req.user // passport makes this available 
  res.render('index', {
    user: req.user
  });

});



module.exports = router;