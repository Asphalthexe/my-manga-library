const express = require('express');
const router = express.Router();
const axios = require('axios');


const loggedInUser = require('../helpers/middlewares').loggedInUser

// model
const User = require('../models/user');
const Book = require('../models/book');




/* do search and GET search result page */
router.get('/', (req, res, next) => {

  if (req.query.search) {
    //axios.get(`https://www.googleapis.com/books/v1/volumes?q=${req.query.search}+intitle:${req.query.search}&key=${process.env.API_KEY}`).then(response => {
    //axios.get(`https://www.googleapis.com/auth/books/v1/volumes?q=${req.query.search}+intitle:${req.query.search}&key=${process.env.API_KEY}`).then(response => {
    //https://www.google.de/search?hl=de&tbo=p&tbm=bks&q=inauthor:%22Tsugumi+%C5%8Cba%22&source=gbs_metadata_r&cad=4
    axios.get(`https://www.googleapis.com/books/v1/volumes?q=intitle:${req.query.search}&langRestrict=de&printType=books&maxResults=40&key=${process.env.API_KEY}`).then(response => {
      console.log("response======>", response.data.items)
      res.render('private/search.hbs', {
        data: response.data.items
      });
    }).catch(error => console.log("error===>", error))
  } else {
    res.render('private/search.hbs');
  }
});

//&filter=partial&maxResults=40
// show only books if volumeInfo.mainCategory has "Manga" or/and "Comics & Graphic Novels" in it
// &q=subject:Manga+Comics

// volumeInfo.industryIdentifiers[].type string	Identifier type. Possible values are ISBN_10, ISBN_13, ISSN and OTHER.	
// volumeInfo.pageCount	integer	Total number of pages.


///////////////////////////////////////////////////
/* Performing a search
You can perform a volumes search by sending an HTTP GET request to the following URI:

https://www.googleapis.com/books/v1/volumes?q=search+terms

This request has a single required parameter:

q - Search for volumes that contain this text string. There are special keywords you can specify in the search terms to search in particular fields, such as:
intitle: Returns results where the text following this keyword is found in the title.
inauthor: Returns results where the text following this keyword is found in the author.
inpublisher: Returns results where the text following this keyword is found in the publisher.
subject: Returns results where the text following this keyword is listed in the category list of the volume.
isbn: Returns results where the text following this keyword is the ISBN number.
lccn: Returns results where the text following this keyword is the Library of Congress Control Number.
oclc: Returns results where the text following this keyword is the Online Computer Library Center number.
 */
////////////////////////////////////////////////////////


// POST
router.post('/', (req, res, next) => {

  console.log("req.body" + req.body.title)
  //save the data like title

  let book = new Book({
    imageLink: req.body.imageLink,
    title: req.body.title,
    authors: req.body.authors,
    owner: req.user.id,
    wishlistowner: req.user.id,
    publisher: req.body.publisher,
    publisherDate: req.body.publisherDate,
    categories: req.body.categories,
    ISBN: req.body.ISBN,
    pageCount: req.body.pageCount,
    description: req.body.description,
    retailPrice: req.body.retailPrice
  })

  book.save().then(() => {
    req.flash('Das Buch wurde zu deinem Regal hinzugefügt')

    //then redirect the user 
    res.redirect('/userlibrary')
  });
})



module.exports = router;