const User = require('../models/user');

module.exports = {
  index: (req, res, next) => {
    User.find({})
      .then(users => {
        // save users data to response object and call middleware
        res.locals.users = users;
        next()
      })
      .catch(error => {
        console.log(`Error fetching users: #${error.message}`)
        next(error);
      });
  },
  // rendering by other action
  indexView: (req, res) => {
    res.render("users/index");
  },
  new: (req, res) => {
    res.render("users/new");
  },
  create: (req, res, next) => {
    let userParams = {
      name: {
        first: req.body.first,
        last: req.body.last
      },
      email: req.body.email,
      password: req.body.password,
      zipCode: req.body.zipCode
    };
    // create a new user object by form params
    User.create(userParams)
      .then(user => {
        res.locals.redirect = "/users";
        res.locals.user = user;
        next();
      })
      .catch(error => {
        console.log(`Error saving a new user: ${error.message}`);
        next(error);
      });
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  show: (req, res, next) => {
    // get user id from request params
    let userId = req.params.id;
    // query to find an user by userId
    User.findById(userId)
      .then(user => {
        console.log('found user', user);
        res.locals.user = user;
        next();
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
      });
  },
  showView: (req, res) => {
    console.log('show view')
    console.log(res.locals.user)
    res.render("users/show"); // path to show.ejs
  }
}