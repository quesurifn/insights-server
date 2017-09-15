var helpers = require('./routeHelpers')
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

  client.hset(sesh, "history", history , redis.print);

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
  let twittername = req.body.twitter
  let accessToken = req.body.token
  let userId = req.body.userid
  let facebookR, twitterR

  //let stringOne = client.hset(sesh, "client", data , redis.print);
  //let stringTwo = client.hget(sesh, "history")
  
  async function main(){
    try {
      facebookR = await helpers.facebook(userId, accessToken)
      twitterR = await helpers.twitter(twittername)
      return await helpers.personalityInsights(`${facebookR} ${twitterR}`)
    } catch (e) {
      console.log('err main', e)
    }
  }

  var final = main()
  .then(r => {
    console.log('fina;' ,r)
  })
  .catch(e => {
    console.log(e, 'final err')
  })


})





module.exports = router;
