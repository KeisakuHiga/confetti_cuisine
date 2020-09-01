const mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  {
    Schema
  } = mongoose,
  Subscriber = require('./subscriber'),
  passportLocalMongoose = require('passport-local-mongoose');

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
  // you don't need password property because of Passport.js: Line 97
  // password: {
  //   type: String,
  //   required: true
  // },
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

// set pre('save') hook
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
// // set pre('save') hook for encrypt password
// userSchema.pre('save', function (next) {
//   let user = this;

//   // hashing password
//   bcrypt.hash(user.password, 10) // here '10' is salt. In cryptography, a salt is random data that is used as an additional input to a one-way function that hashes data, a password or passphrase.
//     .then(hash => {
//       user.password = hash;
//       next();
//     })
//     .catch(error => {
//       console.log(`Error in hashing password: ${error.message}`);
//       next(error);
//     });
// });
// // method to compare the two hash related to password
// userSchema.methods.passwordComparison = function (inputPassword) {
//   let user = this;
//   return bcrypt.compare(inputPassword, user.password); // returns Promise
// };
// adding passport-local-mongoose plugin
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
});

module.exports = mongoose.model("User", userSchema);