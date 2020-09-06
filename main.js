const express = require('express'),
	methodOverride = require('method-override'),
	layout = require('express-ejs-layouts'),
	expressSession = require('express-session'),
	cookieParser = require('cookie-parser'),
	connectFlash = require('connect-flash'),
	passport = require('passport'),
	parser = require('tld-extract'),
	app = express(),
	router = require('./routes/index'),
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

app.use(layout);
app.use(express.static('public'));
app.use(
	express.urlencoded({
		extended: false,
	}),
);
app.use(express.json());
app.use(cookieParser('secret_passcode')); // this pass code is used for encrypting the cookie data
app.use(
	expressSession({
		secret: 'secret_passcode',
		cookie: {
			maxAge: 4000000,
		},
		resave: false,
		saveUninitialized: false,
	}),
);
app.use(connectFlash());
app.use(
	methodOverride('_method', {
		methods: ['POST', 'GET'],
	}),
);
// setting for Passport.js
app.use(passport.initialize());
app.use(passport.session());

// set login strategy
passport.use(User.createStrategy());
// setting for serialize/deserialize user data
passport.serializeUser(User.serializeUser()); // what is serialize? https://pisuke-code.com/js-simplest-way-of-serialization/
passport.deserializeUser(User.deserializeUser());
// custom middleware
app.use((req, res, next) => {
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

// listening port
app.use('/', router);
app.listen(app.get('port'), () => {
	console.log(`Server running at http://localhost:${app.get('port')}`);
});