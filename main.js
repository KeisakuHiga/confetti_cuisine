const express = require('express'),
  app = express(),
  homeController = require('./controllers/homeController'),
  errorController = require('./controllers/errorController');

// Load Mongodb module
const MongoDB = require('mongodb').MongoClient,
  dbURL = "mongodb://localhost:27017",
  dbName = "recipe_db";

// set up db connection locally
MongoDB.connect(dbURL, {
  useUnifiedTopology: true
}, (error, client) => {
  if (error) throw error;
  // get recipe_db by Mongodb server
  let db = client.db(dbName);
  // get all records from contacts collection
  db.collection("contacts")
    .find()
    .toArray((error, data) => {
      if (error) throw error;
      console.log(data);
    });
});

// load express-ejs-layouts, set the layout module to the app
const layout = require('express-ejs-layouts');
app.set("view engine", "ejs");
app.use(layout);

app.set("port", process.env.PORT || 3000);
app.use(express.static("public"));

// middleware
app.use(
  express.urlencoded({
    extended: false
  })
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
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`)
});