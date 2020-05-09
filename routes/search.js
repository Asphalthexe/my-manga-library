const express = require('express');
const router = express.Router();
const axios = require('axios');


const loggedInUser = require('../helpers/middlewares').loggedInUser

// model
const User = require('../models/user');
const Book = require('../models/book');
const Bookshelf = require('../models/bookshelf');




/* GET home page */
router.get('/', (req, res, next) => {
  if (req.query.search) {
    axios.get(`https://www.googleapis.com/books/v1/volumes?q=${req.query.search}+intitle:${req.query.search}&key=${process.env.API_KEY}`).then(response => {
      console.log("response======>", response.data.items)
      res.render('private/search.hbs', {
        data: response.data.items
      });
    }).catch(error => console.log("error===>", error))
  } else {
    res.render('private/search.hbs');
  }
});


// POST
router.post('/', (req, res, next) => {

  console.log("req.body" + req.body.title)
  //save the data like title

  let book = new Book({
    image: req.body.image,
    title: req.body.title,
    authors: req.body.authors,
    owner: req.user.id
    /*     publisher: String,
        releasedate: String,
        pages: String,
        rating: String,
        summary: String, */
  })

  book.save().then(() => {
    req.flash('Das Buch wurde zu deinem Regal hinzugefügt')

    //then redirect the user 
    res.redirect('/userlibrary')
  });
})



module.exports = router;