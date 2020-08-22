// load subscriber module
const Subscriber = require('../models/subscriber');

// get all subscribers data 
exports.getAllSubscribers = (req, res, next) => {
  Subscriber.find({}, (error, subscribers) => {
    // pass error object to middleware
    if (error) {
      console.log(error);
      next(error);
    }
    // set subscribers data got from MongoDB
    console.log('log from subscribersController')
    req.data = subscribers;
    // continue to the next middleware
    next();
  });
};