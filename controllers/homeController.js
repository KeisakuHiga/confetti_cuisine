var courses = [{
    title: "Event Driven Cakes",
    cost: 50
  },
  {
    title: "Asynchronous Artichoke",
    cost: 25
  },
  {
    title: "Object Oriented Orange Juice",
    cost: 10
  }
];
module.exports = {
  index: (req, res) => {
    res.render('index');
  },
  showCourses: (req, res) => {
    res.render('courses/courses', {
      offeredCourses: courses
    });
  }
};