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
  }
}