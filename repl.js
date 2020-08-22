const mongoose = require("mongoose"),
  Subscriber = require("./models/subscriber");

mongoose.connect(
  "mongodb://localhost:27017/recipe_db", {
    useNewUrlParser: true
  }
);

Subscriber.create({
  name: "Jon",
  email: "jon@jonw.com",
  zipCode: 1234567
}).then(subscriber => console.log(subscriber)).catch(error => console.log(error.message));

var subscriber;
var localSubscribers;
Subscriber.findOne({
  name: "Jon"
}).then(result => {
  subscriber = result;
  console.log(subscriber.getInfo())
  localSubscribers = subscriber.findLocalSubscribers()
  console.log(localSubscribers)
})