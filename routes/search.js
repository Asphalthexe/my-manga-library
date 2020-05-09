const express = require('express');
const router = express.Router();
const axios       = require('axios');




/* GET home page */
router.get('/', (req, res, next) => {
 
  axios.get(`https://www.googleapis.com/books/v1/volumes?q=${req.query.search}+intitle:${req.query.search}&key=${process.env.API_KEY}`).then(response => {
    console.log("response======>", response.data.items)
    res.render('private/search.hbs',{data: response.data.items});
  }).catch(error => console.log("error===>", error))
});


module.exports = router;