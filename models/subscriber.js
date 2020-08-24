// load mongoose
const mongoose = require('mongoose');

// create a new schema of subscribers
const subscriberSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  zipCode: {
    type: Number,
    min: [1000000, 'Zip code too short'],
    max: 9999999
  },
  courses: [{ // array should be used when n/n relation
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }]
});

// add instance methods to subscriberSchema
// this method returns info about a subscriber
subscriberSchema.methods.getInfo = function () {
  return `Name: ${this.name} Email: ${this.email} Zip Code: ${this.zipCode}`;
};
// this method finds the subscribers who have the same zip code
subscriberSchema.methods.findLocalSubscribers = function () {
  return this.model("Subscriber")
    .find({
      zipCode: this.zipCode
    })
    .exec(); // access Subscriber model to use find method
};

// adapt the above schema to Model, 1st argument: model name, 2nd argument: the defined schema
module.exports = mongoose.model("Subscriber", subscriberSchema);