const Course = require('../models/course');

module.exports = {
  // get all courses data 
  index: (req, res, next) => {
    Course.find({})
      .then(courses => {
        res.locals.courses = courses;
        next();
      })
      .catch(error => {
        console.log(`Error fetching courses: #${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    res.render("courses/index");
  },
  // rendering new page
  new: (req, res) => {
    res.render("courses/new")
  },
  // save posted courses' data from client form 
  create: (req, res, next) => {
    // create a new Course object
    let courseParams = {
      title: req.body.title,
      description: req.body.description,
      // items: req.body.items,
      zipCode: req.body.zipCode
    };
    // console.log(courseParams)
    Course.create(courseParams)
      .then(course => {
        req.flash("success", `${course.title} has been added successfully`);
        res.locals.redirect = "/courses";
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.log(`Error saving a new course: ${error.message}`);
        res.locals.redirect = "/courses/new";
        req.flash("error", `Failed to add a new course because: ${error.message}.`);
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
    // get course id from request params
    let courseId = req.params.id;
    // query to find an course by courseId
    Course.findById(courseId)
      .then(course => {
        // console.log('found course', course);
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.log(`Error fetching course by ID: ${error.message}`);
      });
  },
  showView: (req, res) => {
    // console.log('show view')
    // console.log(res.locals.course)
    res.render("courses/show"); // path to show.ejs
  },
  edit: (req, res, next) => {
    let courseId = req.params.id;
    // find a course by courseId
    Course.findById(courseId)
      .then(course => {
        // render the found courses' data on edit page
        res.render("courses/edit", {
          course: course
        });
      })
      .catch(error => {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },
  update: (req, res, next) => {
    let courseId = req.params.id,
      courseParams = {
        title: req.body.title,
        description: req.body.description,
        zipCode: req.body.zipCode
      };;
    // find a course and update the courses' data
    Course.findByIdAndUpdate(courseId, {
        $set: courseParams
      })
      .then(course => {
        // console.log(`found course: ${course}`);
        // add updated course data to a local variable
        req.flash("updated", `${course.title} has been updated successfully`);
        res.locals.redirect = `/courses/${courseId}`;
        res.locals.course = course;
        // call middleware
        next();
      })
      .catch(error => {
        console.log(`Error updating course by ID: ${error.message}`);
        res.locals.redirect = `/courses/${courseId}/edit`;
        req.flash("error", `Failed to update the course because: ${error.message}.`);
        next();
      })
  },
  delete: (req, res, next) => {
    let courseId = req.params.id;
    Course.findByIdAndDelete(courseId)
      .then(() => {
        req.flash("deleted", `${courseId} has been deleted successfully`);
        res.locals.redirect = "/courses";
        next();
      })
      .catch(error => {
        console.log(`Error deleting course by ID: ${error.message}`);
        res.locals.redirect = "/courses";
        req.flash("error", `Failed to delete the course because: ${error.message}`);
        next();
      })
  }
}