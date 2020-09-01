const User = require('../models/user'),
	expressValidator = require('express-validator'),
	{
		check,
		sanitizeBody,
		validationResult
	} = expressValidator,
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
	};

module.exports = {
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
					req.flash("success",
						`${user.fullName}'s account created successfully!`);
					res.locals.redirect = "/users";
					next();
				} else {
					req.flash("error",
						`Failed to create user account because: ${error.message}`);
					res.locals.redirect = "/users/new";
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
	authenticate: (req, res, next) => {
		User.findOne({
				email: req.body.email,
			})
			.then((user) => {
				if (user) {
					user.passwordComparison(req.body.password).then((passwordMatch) => {
						if (passwordMatch) {
							res.locals.redirect = `/users/${user.id}`;
							req.flash('success', `${user.fullName}'s logged in successfully`);
							res.locals.user = user;
						} else {
							req.flash(
								'error',
								'Failed to log in user account: Incorrect Password.',
							);
							res.locals.redirect = '/users/login';
						}
						next();
					});
				} else {
					req.flash(
						'error',
						'Failed to log in user account: User account not found.',
					);
					res.locals.redirect = '/users/login';
					next();
				}
			})
			.catch((error) => {
				console.log(`Error logging in user: ${error.message}`);
				next(error);
			});
	},
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
};