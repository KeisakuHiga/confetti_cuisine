const express = require('express'),
  app = express(),
  homeController = require('./controllers/homeController'),
  errorController = require('./controllers/errorController');

// load mongoose
const mongoose = require('mongoose');

// set up db connection
mongoose.connect(
  "mongodb://localhost:27017/recipe_db", {
    useUnifiedTopology: true,
    useNewUrlParser: true
  }
);
const db = mongoose.connection;
db.once("open", () => {
  console.log("Successfully connected to MongoDB using mongoose!");
});

const Subscriber = require('./models/subscriber');

// create a new Subscriber object - part1 using 'new' and 'save' method
var subscriber1 = new Subscriber({ // use 'new'
  name: "iPhone 7",
  email: "i7@apple.com"
});
subscriber1.save((error, savedDoc) => { // use 'save'
  if (error) console.log(error);
  console.log(savedDoc);
});

// create a new Subscriber object - part2 using 'create' method
Subscriber.create({
    name: "Michel Jordan",
    email: "mj@mj.com"
  },
  (error, savedDoc) => {
    if (error) console.log(error);
    console.log(savedDoc);
  }
);

// get all documents from Subscriber
Subscriber.find({}, (error, allDocs) => {
  if (error) console.log(error.stack);
  console.log("Here is all documents:\n", allDocs);
})

// create a query to get one document using findOne method
var myQuery = Subscriber
  .findOne({
    name: "Jon Wexler"
  })
  .where("email", /wexler/)

// execute the above query coping with the callback function
myQuery.exec((error, data) => {
  if (error) console.log(error);
  if (data) console.log(data.email);
});

// load express-ejs-layouts, set the layout module to the app
const layout = require('express-ejs-layouts');
const e = require('express');
app.set('view engine', 'ejs');
app.use(layout);

app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));

// middleware
app.use(
  express.urlencoded({
    extended: false,
  }),
);
app.use(express.json());

// make route
app.get('/', homeController.index);
app.get('/courses', homeController.showCourses);
app.get('/contact', homeController.showSignUp);
app.post('/contact', homeController.postedSignUpForm);

// error handling for routes
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

// listening port
app.listen(app.get('port'), () => {
  console.log(`Server running at http://localhost:${app.get('port')}`);
});