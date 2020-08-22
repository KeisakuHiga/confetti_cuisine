const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  items: [],
  zipCode: {
    type: Number,
    min: [1000000, 'Zip code too short'],
    max: 999999
  }
  // you don't need to put subscribers property here
  // because it is enough to set one side to have a relation between two models
  // subscribers: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Subscriber"
  // }]
});

module.exports = mongoose.model("Course", courseSchema);