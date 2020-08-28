const mongoose = require('mongoose'),
  {
    Schema
  } = mongoose,
  Subscriber = require('./subscriber');

// create User schema
const userSchema = new Schema({
  name: {
    first: {
      type: String,
      trim: true
    },
    last: {
      type: String,
      trim: true
    }
  },
  email: {
    type: String,
    required: true,
    // lowercase: true,
    unique: true
  },
  zipCode: {
    type: Number,
    min: [1000000, 'Zip code too short'],
    max: 9999999
  },
  password: {
    type: String,
    required: true
  },
  courses: [{
    type: Schema.Types.ObjectId,
    ref: "Course"
  }],
  subscribedAccount: {
    type: Schema.Types.ObjectId,
    ref: "Subscriber"
  }
}, {
  timestamps: true
});

// adding virtual property to get user's full name 
userSchema.virtual("fullName")
  .get(function () {
    return `${this.name.first} ${this.name.last}`;
  });

// set pre('save) hook
userSchema.pre('save', function (next) {
  let user = this;
  // check if there is a subscriber who has the same email address with a new user
  if (user.subscribedAccount === undefined) {
    // query to find the subscriber
    Subscriber.findOne({
        email: user.email
      })
      .then(subscriber => {
        user.subscribedAccount = subscriber;
        next();
      })
      .catch(error => {
        console.log(`Error in connecting subscriber: ${error.message}`);
        next(error);
      });
  } else {
    // the new user has the connection of a subscriber
    next();
  }
});
module.exports = mongoose.model("User", userSchema);