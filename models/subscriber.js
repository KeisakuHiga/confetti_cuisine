// load mongoose
const mongoose = require('mongoose');

// create a new schema of subscribers
const subscriberSchema = mongoose.Schema({
  name: String, // add schema property
  email: String,
  zipCode: Number
});
// adapt the above schema to Model, 1st argument: model name, 2nd argument: the defined schema
module.exports = mongoose.model("Subscriber", subscriberSchema);