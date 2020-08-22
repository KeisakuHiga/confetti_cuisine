// load subscriber module
const Subscriber = require('../models/subscriber');

// get all subscribers data 
exports.getAllSubscribers = (req, res) => {
  Subscriber.find({})
    .exec()
    .then(result => {
      res.render("subscribers", {
        subscribers: result
      });
    })
    .catch(error => {
      console.log(error.message);
      return [];
    })
    .then(() => {
      console.log('promise complete');
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

  newSubscriber.save()
    .then(result => {
      console.log(`Saved new subscriber: \n${result}`)
      res.render("thanks");
    })
    .catch(error => {
      if (error) res.send(error);
    });
};