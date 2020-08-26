const express = require('express'),
  app = express(),
  homeController = require('./controllers/homeController'),
  subscribersController = require('./controllers/subscribersController'),
  coursesController = require('./controllers/coursesController'),
  usersController = require('./controllers/usersController'),
  errorController = require('./controllers/errorController');

// load mongoose
const mongoose = require('mongoose');

// tell mongoose to use ES6's native Promise
mongoose.Promise = global.Promise;

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

// load express-ejs-layouts, set the layout module to the app
const layout = require('express-ejs-layouts');
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
app.get('/contact', subscribersController.getSubscriptionPage);
app.get('/users', usersController.index, usersController.indexView);
app.post('/subscribe', subscribersController.saveSubscriber);
app.get('/subscribers', subscribersController.getAllSubscribers, (req, res, next) => {
  // log subscribers data from request object
  console.log(req.data);
  res.render("subscribers", { subscribers: req.data });
});

// error handling for routes
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

// listening port
app.listen(app.get('port'), () => {
  console.log(`Server running at http://localhost:${app.get('port')}`);
});