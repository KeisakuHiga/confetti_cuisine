// load subscriber module
const Subscriber = require('../models/subscriber'),
	getSubscriberParams = (body) => {
		return {
			name: body.name,
			email: body.email,
			zipCode: parseInt(body.zipCode),
		};
	};

module.exports = {
	// get all subscribers data
	index: (req, res, next) => {
		Subscriber.find({})
			.then((subscribers) => {
				res.locals.subscribers = subscribers;
				next();
			})
			.catch((error) => {
				console.log(`Error fetching subscribers: #${error.message}`);
				next(error);
			});
	},
	indexView: (req, res) => {
		res.render('subscribers/index');
	},
	// rendering new page
	new: (req, res) => {
		res.render('subscribers/new');
	},
	// save posted subscribers' data from client form
	create: (req, res, next) => {
		// create a new Subscriber object
		let subscriberParams = getSubscriberParams(req.body);
		// console.log(subscriberParams)
		Subscriber.create(subscriberParams)
			.then((subscriber) => {
				req.flash("success", `${subscriber.name} was added to our subscribed members successfully`);
				res.locals.redirect = '/subscribers';
				res.locals.subscriber = subscriber;
				next();
			})
			.catch((error) => {
				console.log(`Error saving a new subscriber: ${error.message}`);
				res.locals.redirect = "/subscribers/new";
				req.flash("error", `Failed to create subscriber account because: ${error.message}.`);
				next();
			});
	},
	redirectView: (req, res, next) => {
		let redirectPath = res.locals.redirect;
		// console.log(redirectPath)
		if (redirectPath) res.redirect(redirectPath);
		else next();
	},
	show: (req, res, next) => {
		// get subscriber id from request params
		let subscriberId = req.params.id;
		// query to find an subscriber by subscriberId
		Subscriber.findById(subscriberId)
			.then((subscriber) => {
				// console.log('found subscriber', subscriber);
				res.locals.subscriber = subscriber;
				next();
			})
			.catch((error) => {
				console.log(`Error fetching subscriber by ID: ${error.message}`);
			});
	},
	showView: (req, res) => {
		// console.log('show view')
		// console.log(res.locals.subscriber)
		res.render('subscribers/show'); // path to show.ejs
	},
	edit: (req, res, next) => {
		let subscriberId = req.params.id;
		// find a subscriber by subscriberId
		Subscriber.findById(subscriberId)
			.then((subscriber) => {
				// render the found subscribers' data on edit page
				res.render('subscribers/edit', {
					subscriber: subscriber,
				});
			})
			.catch((error) => {
				console.log(`Error fetching subscriber by ID: ${error.message}`);
				next(error);
			});
	},
	update: (req, res, next) => {
		let subscriberId = req.params.id,
			subscriberParams = getSubscriberParams(req.body);
		// find a subscriber and update the subscribers' data
		Subscriber.findByIdAndUpdate(subscriberId, {
				$set: subscriberParams,
			})
			.then((subscriber) => {
				// console.log(`found subscriber: ${subscriber}`);
				// add updated subscriber data to a local variable
        req.flash("updated", `${subscriber.name} has been updated successfully`);
        res.locals.redirect = `/subscribers/${subscriberId}`;
				res.locals.subscriber = subscriber;
				// call middleware
				next();
			})
			.catch((error) => {
				console.log(`Error updating subscriber by ID: ${error.message}`);
        res.locals.redirect = `/subscribers/${subscriberId}/edit`;
        req.flash("error", `Failed to update subscriber because: ${error.message}.`);
        next();
			});
	},
	delete: (req, res, next) => {
		let subscriberId = req.params.id;
		Subscriber.findByIdAndDelete(subscriberId)
			.then(() => {
        req.flash("deleted", `${subscriberId} has been deleted successfully`);
        res.locals.redirect = '/subscribers';
				next();
			})
			.catch((error) => {
				console.log(`Error deleting subscriber by ID: ${error.message}`);
        res.locals.redirect = "/subscribers";
        req.flash("error", `Failed to delete subscriber because: ${error.message}`);
        next();
			});
	},
};