const mongoose = require("mongoose"),
  Subscriber = require("./models/subscriber"),
  Course = require("./models/course");
  
var testCourse,
  testSubscriber;

mongoose.connect(
  "mongodb://localhost:27017/recipe_db",
  { useNewUrlParser: true,
    useUnifiedTopology: true}
);

mongoose.Promise = global.Promise;

// copy codes from the book
Subscriber.remove({}).then(items => console.log(`Removed ${items.n} records!`)).then(() => {
    return Course.remove({});
  }).then(items => console.log(`Removed ${items.n} records!`)).then(() => {
    return Subscriber.create({
      name: "Jon",
      email: "jon@jonwexler.com",
      zipCode: 1234567
    });
  }).then(subscriber => {
    console.log(`Created Subscriber: ${subscriber.getInfo()}`);
  }).then(() => {
    return Subscriber.findOne({
      name: "Jon"
    });
  }).then(subscriber => {
    testSubscriber = subscriber;
    console.log(`Found one subscriber: ${subscriber.getInfo()}`);
  }).then(() => {
    return Course.create({
      title: "Tomato Land",
      description: "Locally farmed tomatoes only",
      zipCode: 1234567,
      items: ["cherry", "heirloom"]
    });
  }).then(course => {
    testCourse = course;
    console.log(`Created course: ${course.title}`);
  }).then(() => {
    testSubscriber.courses.push(testCourse);
    testSubscriber.save();
  }).then(() => {
    return Subscriber.populate(testSubscriber, "course");
  }).then(subscriber => console.log(subscriber)).then(() => {
    return Subscriber.find(
      { courses: mongoose.Types.ObjectId(testCourse._id) });
  }).then(subscriber => console.log(subscriber));
// original // delete all contacts
// Subscriber.deleteMany({})
//   .then(result => console.log('Deleted all contacts')).catch(error => console.log(error.message))

// Subscriber.create({
//   name: "Jon",
//   email: "jon@jonw.com",
//   zipCode: 1234567
// }).then(subscriber => console.log(subscriber)).catch(error => console.log(error.message));

// Subscriber.findOne({
//   name: "Jon"
// }).then(result => {
//   subscriber = result;
//   console.log(subscriber.getInfo())
// });

// Course.create({
//   title: "Tomato juice",
//   description: "Many tomatoes",
//   items: ["cherry", "heirloom"]
// }).then(course => testCourse = course);

// // find subscriber
// Subscriber.findOne({}).then(
//   subscriber => testSubscriber = subscriber
// );

// // push testCourse to array of testSubscriber
// testSubscriber.courses.push(testCourse);

// // save testSubscriber instance
// testSubscriber.save();

// // write course on subscribe model by populate method
// Subscriber.populate(testSubscriber, "courses").then(subscriber => {
//   console.log(subscriber)
// }).catch(error => console.log(error.message));