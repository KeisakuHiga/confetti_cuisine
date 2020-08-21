const express = require('express'),
  app = express(),
  homeController = require('./controllers/homeController'),
  errorController = require('./controllers/errorController');

// load express-ejs-layouts, set the layout module to the app
const layout = require('express-ejs-layouts');
app.set("view engine", "ejs");
app.use(layout);
Æ
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