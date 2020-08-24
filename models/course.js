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
    max: 9999999
  },
  subscribers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscriber"
  }]
});

module.exports = mongoose.model("Course", courseSchema);