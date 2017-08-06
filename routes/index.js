var express = require('express');
var router = express.Router();

var redis = require("redis"),
    client = redis.createClient();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/lol', function(req, res, next) {
  res.render('index', { title: req.sessionID });
});


/* 

    Redis History 


*/


router.post('/history', function(req, res) {
  let history = req.body.history
  let sesh = req.sessionID

  console.log(history)
  console.log(sesh)

  client.hset(sesh, "history", history ,redis.print);

  client.on('error', function(err){
    console.log(err)
    res.status().send({"status":"error"})
  })

  res.status(200).send({"status":"success"})
})

router.post('/client', function(req, res) {
  let history = req.body.data
  let sesh = req.sessionID

  console.log(history)
  console.log(sesh)

  client.hset(sesh, "client", history , redis.print);

  client.on('error', function(err){
    console.log(err)
    res.status().send({"status":"error"})
  })

  res.status(200).send({"status":"success"})
})




module.exports = router;
