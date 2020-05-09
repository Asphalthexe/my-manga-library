

let loggedInUser = (req, res, next) => {
  // req.user // passport makes this available 
  if (req.user) {
    next()
  } else {
    req.flash('message', 'Du musst eingeloogt sein, um diese Seite zu sehen.')
    //req.flash('message', 'this is Message 2')
    res.redirect('/auth/login?redirectBackTo=' + req.path)
    //res.send('test')
  }
}

/* 
let userIsAdmin = (req, res, next) => {
  if (req.user.role === 'admin') {
    next()
  } else {
    res.send('you need to be admin to view this page')
  }
} */


module.exports = {
  loggedInUser: loggedInUser,
  //userIsAdmin: userIsAdmin 
}