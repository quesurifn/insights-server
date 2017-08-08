var express = require('express');
var router = express.Router();
require('dotenv').config()
var redis = require("redis"),
    client = redis.createClient();

var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');

var personality_insights = new PersonalityInsightsV3({
  username: process.env.WATSON_USERNAME,
  password: process.env.WATSON_PASSWORD,
  version_date: '2016-10-19'
});


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

  res.status(200).send({"status":"success", "msg":"Added to DB"})
})


/* 

  Core Call 

*/
router.get('/refresh', function(req, res) {
  let sesh = req.sessionID

  let object;
  client.hgetall(sesh, function(err, reply) {
    if (err) {
        console.log('err', err)

    } else { 
      console.log('reply', reply)
    }
    object = reply || err;
  })


  if (object != null) {
    res.send({"Status":"OK"})
  } else { 
    res.send({"Status":"ERR"})
  }

})



router.post('/client', function(req, res) {
  let data = req.body.data
  let sesh = req.sessionID
  let profile

  console.log(history)
  console.log(sesh)

  
  let stringOne = client.hset(sesh, "client", data , redis.print);
  let stringTwo = client.hget(sesh, "history")

  let fullString = stringOne + stringTwo

  personality_insights.profile({
  text: fullString,
  consumption_preferences: true
  },
  function (err, response) {
    if (err) {
      console.log('error:', err);
      res.status(500).send({"status":"error", "msg":"Something happened. Please try your request later. "})
     } else {
      console.log(JSON.stringify(response, null, 2));
      client.del(sesh)
      res.status(200).send({"status":"success", "data": response})
     }

  });
})





module.exports = router;
