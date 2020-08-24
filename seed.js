const mongoose = require('mongoose'),
  Subscriber = require('./models/subscriber');

// MongoDB setup 
mongoose.connect(
  "mongodb://localhost:27017/recipe_db", {
    useUnifiedTopology: true,
    useNewUrlParser: true
  }
);
// don't know what it is
mongoose.connection;

var contacts = [{
    name: "Keisaku",
    email: "keisaku@higa.com",
    zipCode: 1234567
  },
  {
    name: "Hiroshi",
    email: "hiroshi@higa.com",
    zipCode: 1234567
  },
  {
    name: "Keiko",
    email: "keiko@higa.com",
    zipCode: 1234567
  },
  {
    name: "Mayumi",
    email: "mayumi@higa.com",
    zipCode: 1234567
  },
  {
    name: "Hiroto",
    email: "hiroto@higa.com",
    zipCode: 1234567
  },
  {
    name: "Nawo",
    email: "nawo@yogi.com",
    zipCode: 1234567
  }
];

// delete all contact data
Subscriber
  .deleteMany()
  .exec()
  .then(() => {
    console.log('Deleted all contacts');
  })
  .catch(error => {
    console.log(error);
  })

var commands = [];

// create Promise object to loop contacts data
contacts.forEach(contact => {
  commands.push(Subscriber.create({
    name: contact.name,
    email: contact.email,
    zipCode: contact.zipCode
  }));
});
console.log('commands: \n', commands)

// confirm logs after resolving Promise
Promise.all(commands)
  .then(result => {
    console.log(JSON.stringify(result));
    mongoose.connection.close();
    console.log('finished seeding data');
  })
  .catch(error => {
    console.log('ERROR: \n', error);
  })