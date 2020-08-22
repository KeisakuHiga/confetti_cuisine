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
  }
});
// adapt the above schema to Model, 1st argument: model name, 2nd argument: the defined schema
module.exports = mongoose.model("Subscriber", subscriberSchema);