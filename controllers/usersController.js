const User = require('../models/user'),
	passport = require('passport'),
	expressValidator = require('express-validator'),
	{ check, sanitizeBody, validationResult } = expressValidator,
	getUserParams = (body) => {
		return {
			name: {
				first: body.first,
				last: body.last,
			},
			email: body.email,
			password: body.password,
			zipCode: body.zipCode,
		};
	},
	token = process.env.TOKEN || 'recipeT0k3n',
	jsonWebToken = require('jsonwebtoken');

module.exports = {
	verifyToken: (req, res, next) => {
		let token = req.query.apiToken;
		// check if there is an apiToken provided by query params
		if (token) {
			// check if there is an user whose apiToken is match with token
			User.findOne({
				apiToken: token,
			})
				.then((user) => {
					if (user) {
						next();
					} else {
						next(new Error('Invalid API token.'));
					}
				})
				.catch((error) => {
					next(new Error(error.message));
				});
			next();
		} else {
			next(new Error('Invalid API Token.'));
		}
	},
	apiAuthenticate: (req, res, next) => {
		// use passport authenticate method for user authentication
		passport.authenticate('local', (errors, user) => {
			if (user) {
				// put signature JWT if there is an user matching with the email and password
				let signedToken = jsonWebToken.sign(
					{
						data: user._id,
						expiration: new Date().setDate(new Date().getDate() + 1)
					},
					"secret_encoding_passphrase"
				);
				// response with JWT
				res.json({
					success: true,
					token: signedToken
				});
			} else {
				// response with error message
				res.json({
					success: false,
					message: "Could not authenticate user."
				});
			}
		})(req, res, next);
	},
	index: (req, res, next) => {
		User.find({})
			.then((users) => {
				// save users data to response object and call middleware
				res.locals.users = users;
				next();
			})
			.catch((error) => {
				console.log(`Error fetching users: #${error.message}`);
				next(error);
			});
	},
	// rendering by other action
	indexView: (req, res) => {
		res.render('users/index');
	},
	new: (req, res) => {
		res.render('users/new');
	},
	create: (req, res, next) => {
		// console.log('first line in create action: ', req.skip);
		if (req.skip) {
			next();
		} else {
			let newUser = getUserParams(req.body);
			// register new user
			User.register(newUser, req.body.password, (error, user) => {
				if (user) {
					req.flash(
						'success',
						`${user.fullName}'s account created successfully!`,
					);
					res.locals.redirect = '/users';
					next();
				} else {
					req.flash(
						'error',
						`Failed to create user account because: ${error.message}`,
					);
					res.locals.redirect = '/users/new';
					next();
				}
			});
		}
	},
	redirectView: (req, res, next) => {
		// console.log('skipped?: ', req.skip);
		let redirectPath = res.locals.redirect;
		if (redirectPath) res.redirect(redirectPath);
		else next();
	},
	show: (req, res, next) => {
		// get user id from request params
		let userId = req.params.id;
		// query to find an user by userId
		User.findById(userId)
			.then((user) => {
				// console.log('found user', user);
				res.locals.user = user;
				next();
			})
			.catch((error) => {
				console.log(`Error fetching user by ID: ${error.message}`);
			});
	},
	showView: (req, res) => {
		// console.log('show view')
		// console.log(res.locals.user)
		res.render('users/show'); // path to show.ejs
	},
	edit: (req, res, next) => {
		let userId = req.params.id;
		// find a user by userId
		User.findById(userId)
			.then((user) => {
				// render the found users' data on edit page
				res.render('users/edit', {
					user: user,
				});
			})
			.catch((error) => {
				console.log(`Error fetching user by ID: ${error.message}`);
				next(error);
			});
	},
	update: (req, res, next) => {
		let userId = req.params.id,
			userParams = getUserParams(req.body);
		// find a user and update the users' data
		User.findByIdAndUpdate(userId, {
			$set: userParams,
		})
			.then((user) => {
				// console.log(`found user: ${user}`);
				// add updated user data to a local variable
				req.flash('updated', `${user.fullName}'s account updated successfully`);
				res.locals.redirect = `/users/${userId}`;
				res.locals.user = user;
				// call middleware
				next();
			})
			.catch((error) => {
				console.log(`Error updating user by ID: ${error.message}`);
				res.locals.redirect = `/users/${userId}/edit`;
				req.flash(
					'error',
					`Failed to update user account because: ${error.message}.`,
				);
				next();
			});
	},
	delete: (req, res, next) => {
		let userId = req.params.id;
		User.findByIdAndDelete(userId)
			.then(() => {
				req.flash('deleted', `${userId} has been deleted successfully`);
				res.locals.redirect = '/users';
				next();
			})
			.catch((error) => {
				console.log(`Error deleting user by ID: ${error.message}`);
				res.locals.redirect = '/users';
				req.flash(
					'error',
					`Failed to delete user account because: ${error.message}`,
				);
				next();
			});
	},
	login: (req, res) => {
		res.render('users/login');
	},
	authenticate: passport.authenticate('local', {
		failureRedirect: '/users/login',
		failureFlash: 'Failed to login',
		successRedirect: '/',
		successFlash: 'Logged in!',
	}),
	validate: [
		sanitizeBody('email')
			.normalizeEmail({
				// change email characters to lowercase and trim unnecessary space
				all_lowercase: true,
			})
			.trim(),
		check('email', 'Email is invalid').isEmail(),
		// check zipCode field
		check('zipCode', 'Zip code is invalid').notEmpty().isInt().isLength({
			min: 7,
			max: 7,
		}),
		// check password field
		check('password', 'Password cannot be empty').notEmpty(),
	],
	getValidationResult: (req, res, next) => {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			let messages = result.array().map((errorObj) => {
				return errorObj.msg;
			});
			req.skip = true; // set skip property
			// add error message into flash message
			req.flash('error', messages.join(' and '));
			// set redirect path which lead to 'new' view
			res.locals.redirect = '/users/new';
			next();
		} else {
			next(); // there is no error
		}
	},
	logout: (req, res, next) => {
		req.logout();
		req.flash('success', 'You have been logged out!');
		res.locals.redirect = '/';
		next();
	},
};
