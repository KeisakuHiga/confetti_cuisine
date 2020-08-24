// load subscriber module
const Subscriber = require('../models/subscriber');

module.exports = {
  // get all subscribers data 
  getAllSubscribers: (req, res) => {
    Subscriber.find({})
      .exec()
      .then(result => {
        res.render("subscribers/subscribers", {
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
  },
  // rendering contact page
  getSubscriptionPage: (req, res) => {
    res.render("subscribers/contact")
  },
  // save posted subscribers' data from client form 
  saveSubscriber: (req, res) => {
    // create a new Subscriber object
    let newSubscriber = new Subscriber({
      name: req.body.name,
      email: req.body.email,
      zipCode: req.body.zipCode
    });

    newSubscriber.save()
      .then(result => {
        console.log(`Saved new subscriber: \n${result}`)
        res.render("subscribers/thanks");
      })
      .catch(error => {
        if (error) res.send(error);
      });
  }
}