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



// DELETE
// POST /userlibrary/delete/:identifier
router.post('/delete/:identifier', (req, res) => {

  console.log(req.params.identifier)

  Book.findByIdAndDelete(req.params.identifier).then(() => {
    res.redirect('/userlibrary')
  })

})



module.exports = router;