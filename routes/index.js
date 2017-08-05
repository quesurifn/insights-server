var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session)
  res.render('index', { title: 'Express' });
});
router.get('/lol', function(req, res, next) {
  console.log(req.sessionID)
  res.render('index', { title: req.session });
});
module.exports = router;
