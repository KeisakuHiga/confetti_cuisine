const mongoose = require('mongoose'),
  {
    Schema
  } = mongoose;

const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  // items: [],
  maxStudents: {
    type: Number,
    default: 0,
    min: [0, "Course cannot have a negative number of students"]
  },
  cost: {
    type: Number,
    default: 0,
    min: [0, "Course cannot have a negative cost"]
  },
  zipCode: {
    type: Number,
    min: [1000000, 'Zip code too short'],
    max: 9999999
  },
  subscribers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscriber"
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model("Course", courseSchema);