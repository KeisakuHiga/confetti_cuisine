const express = require('express'),
  methodOverride = require('method-override'),
  app = express(),
  router = express.Router(),
  // homeController = require('./controllers/homeController'),
  subscribersController = require('./controllers/subscribersController'),
  coursesController = require('./controllers/coursesController'),
  usersController = require('./controllers/usersController'),
  errorController = require('./controllers/errorController');

// load mongoose
const mongoose = require('mongoose');

// tell mongoose to use ES6's native Promise
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
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
app.use('/', router);
router.use(methodOverride("_method", {
  methods: ["POST", "GET"]
}));
// courses routes
router.get('/courses', coursesController.index, coursesController.indexView);
router.get('/courses/new', coursesController.new);
router.post('/courses/create', coursesController.create, coursesController.redirectView);
router.get('/courses/:id', coursesController.show, coursesController.showView);
router.get('/courses/:id/edit', coursesController.edit);
router.put('/courses/:id/update', coursesController.update, coursesController.redirectView);
router.delete('/courses/:id/delete', coursesController.delete, coursesController.redirectView);
// subscribers routes
router.get('/subscribers', subscribersController.index, subscribersController.indexView);
router.get('/subscribers/new', subscribersController.new);
router.post('/subscribers/create', subscribersController.create, subscribersController.redirectView);
router.get('/subscribers/:id', subscribersController.show, subscribersController.showView);
router.get('/subscribers/:id/edit', subscribersController.edit);
router.put('/subscribers/:id/update', subscribersController.update, subscribersController.redirectView);
router.delete('/subscribers/:id/delete', subscribersController.delete, subscribersController.redirectView);
// users routes
router.get('/users', usersController.index, usersController.indexView);
router.get('/users/new', usersController.new);
router.post('/users/create', usersController.create, usersController.redirectView);
router.get('/users/:id', usersController.show, usersController.showView);
router.get('/users/:id/edit', usersController.edit);
router.put('/users/:id/update', usersController.update, usersController.redirectView);
router.delete('/users/:id/delete', usersController.delete, usersController.redirectView);

// error handling for routes
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

// listening port
app.listen(app.get('port'), () => {
  console.log(`Server running at http://localhost:${app.get('port')}`);
});