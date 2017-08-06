var express = require('express');
var router = express.Router();

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

router.post('/client', function(req, res) {
  let history = req.body.data
  let sesh = req.sessionID
  let profile

  console.log(history)
  console.log(sesh)

  client.hset(sesh, "client", history , redis.print);


  personality_insights.profile({
  text: 'Enter more than 100 unique words here...',
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
