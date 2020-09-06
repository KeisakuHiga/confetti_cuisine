const express = require('express'),
	methodOverride = require('method-override'),
	layout = require('express-ejs-layouts'),
	expressSession = require('express-session'),
	cookieParser = require('cookie-parser'),
	connectFlash = require('connect-flash'),
	passport = require('passport'),
	parser = require('tld-extract'),
	app = express(),
	router = express.Router(),
	homeController = require('./controllers/homeController'),
	subscribersController = require('./controllers/subscribersController'),
	coursesController = require('./controllers/coursesController'),
	usersController = require('./controllers/usersController'),
	errorController = require('./controllers/errorController'),
	User = require('./models/user');

// load mongoose
const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/recipe_db';
const options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
};

// tell mongoose to use ES6's native Promise
mongoose.Promise = global.Promise;
// set up db connection
mongoose.connect(url, options);
const db = mongoose.connection;
db.once('open', () => {
	console.log('Successfully connected to MongoDB using mongoose!');
});

// load express-ejs-layouts, set the layout module to the app
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

router.use(layout);
router.use(express.static('public'));
router.use(
	express.urlencoded({
		extended: false,
	}),
);
router.use(express.json());
router.use(cookieParser('secret_passcode')); // this pass code is used for encrypting the cookie data
router.use(
	expressSession({
		secret: 'secret_passcode',
		cookie: {
			maxAge: 4000000,
		},
		resave: false,
		saveUninitialized: false,
	}),
);
router.use(connectFlash());
router.use(
	methodOverride('_method', {
		methods: ['POST', 'GET'],
	}),
);
// setting for Passport.js
router.use(passport.initialize());
router.use(passport.session());

// set login strategy
passport.use(User.createStrategy());
// setting for serialize/deserialize user data
passport.serializeUser(User.serializeUser()); // what is serialize? https://pisuke-code.com/js-simplest-way-of-serialization/
passport.deserializeUser(User.deserializeUser());
// custom middleware
router.use((req, res, next) => {
	// put flash message into response' local variable
	res.locals.flashMessages = req.flash();

	// setting passport login status
	res.locals.loggedIn = req.isAuthenticated();
	res.locals.currentUser = req.user;
	console.log('login?: ', res.locals.loggedIn);
	console.log('current user: ', res.locals.currentUser);
	if (req.isAuthenticated()) {
		const email = res.locals.currentUser.email;
		const address = email.split('@').pop();
		const host = parser.parse_host(address);
		// console.log('tld: ', host.tld);
		console.log('domain: ', host.domain);
		// console.log('sub: ', host.sub);
	}

	next();
});
// courses routes
router.get('/', homeController.index);
router.get('/courses', coursesController.index, coursesController.indexView);
router.get('/courses/new', coursesController.new);
router.post(
	'/courses/create',
	coursesController.create,
	coursesController.redirectView,
);
router.get('/courses/:id', coursesController.show, coursesController.showView);
router.get('/courses/:id/edit', coursesController.edit);
router.put(
	'/courses/:id/update',
	coursesController.update,
	coursesController.redirectView,
);
router.delete(
	'/courses/:id/delete',
	coursesController.delete,
	coursesController.redirectView,
);
// subscribers routes
router.get(
	'/subscribers',
	subscribersController.index,
	subscribersController.indexView,
);
router.get('/subscribers/new', subscribersController.new);
router.post(
	'/subscribers/create',
	subscribersController.create,
	subscribersController.redirectView,
);
router.get(
	'/subscribers/:id',
	subscribersController.show,
	subscribersController.showView,
);
router.get('/subscribers/:id/edit', subscribersController.edit);
router.put(
	'/subscribers/:id/update',
	subscribersController.update,
	subscribersController.redirectView,
);
router.delete(
	'/subscribers/:id/delete',
	subscribersController.delete,
	subscribersController.redirectView,
);
// users routes
router.get('/users', usersController.index, usersController.indexView);
router.get('/users/new', usersController.new);
router.post(
	'/users/create',
	usersController.validate,
	usersController.getValidationResult,
	usersController.create,
	usersController.redirectView,
);
router.get('/users/login', usersController.login);
router.post('/users/login', usersController.authenticate);
router.get('/users/logout', usersController.logout, usersController.redirectView); // HTTP request should be GET !!
router.get('/users/:id', usersController.show, usersController.showView);
router.get('/users/:id/edit', usersController.edit);
router.put(
	'/users/:id/update',
	usersController.update,
	usersController.redirectView,
);
router.delete(
	'/users/:id/delete',
	usersController.delete,
	usersController.redirectView,
);

// error handling for routes
router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

// listening port
app.use('/', router);
app.listen(app.get('port'), () => {
	console.log(`Server running at http://localhost:${app.get('port')}`);
});