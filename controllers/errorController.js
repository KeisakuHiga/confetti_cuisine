const httpStatus = require('http-status-codes');

module.exports = {
  pageNotFoundError: (req, res) => {
    let errorCode = httpStatus.NOT_FOUND;
    res.status(errorCode);
    // res.render('error');
    console.log(errorCode)
    res.render(`${errorCode}`);
  },
  internalServerError: (error, req, res, next) => {
    let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
    res.status(errorCode);
    console.log(`ERROR occurred: ${error.stack}`);
    // res.render(`${errorCode} | Sorry, our application is taking a nap!`);
    res.render(`${errorCode}`);
  }
}