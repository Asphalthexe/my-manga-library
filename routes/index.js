const express = require('express');
const router  = express.Router();


//key=API_KEY AIzaSyDc-JlUAhavmjuRpJu72REwMQaEklY8M-A


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
