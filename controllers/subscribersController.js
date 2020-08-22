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

// rendering contact page
exports.getSubscriptionPage = (req, res) => {
  res.render("contact")
};
// save posted subscribers' data from client form 
exports.saveSubscriber = (req, res) => {
  // create a new Subscriber object
  let newSubscriber = new Subscriber({
    name: req.body.name,
    email: req.body.email,
    zipCode: req.body.zipCode
  });

  newSubscriber.save((error, result) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
    console.log(`Successfully saved a new subscriber: \n${result}`)
    res.render('thanks');
  });
};