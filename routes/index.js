const router = require('express').Router(),
  // load all routes here
  userRoutes = require('./userRoutes'),
  subscriberRoutes = require('./subscriberRoutes'),
  courseRoutes = require('./courseRoutes'),
  errorRoutes = require('./errorRoutes'),
  homeRoutes = require('./homeRoutes');

router.use("/users", userRoutes)
router.use("/subscribers", subscriberRoutes)
router.use("/courses", courseRoutes)
router.use("/", homeRoutes)
router.use("/", errorRoutes)

module.exports = router;