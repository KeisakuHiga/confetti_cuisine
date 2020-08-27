// load subscriber module
const Subscriber = require('../models/subscriber');

module.exports = {
  // get all subscribers data 
  index: (req, res, next) => {
    Subscriber.find({})
      .then(subscribers => {
        res.locals.subscribers = subscribers;
        next();
      })
      .catch(error => {
        console.log(`Error fetching subscribers: #${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    res.render("subscribers/index");
  },
  // rendering contact page
  new: (req, res) => {
    res.render("subscribers/new")
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