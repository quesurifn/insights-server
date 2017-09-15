var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
var graph                 = require('fbgraph');
var Twit                  = require('twit')

require('dotenv').config()

var T = new Twit({
  consumer_key:          process.env.CONSUMER_KEY,
  consumer_secret:       process.env.CONSUMER_SECRET,
  access_token:          process.env.ACCESS_TOKEN,
  access_token_secret:   process.env.ACCESS_TOKEN_SECRET,
})

var personality_insights = new PersonalityInsightsV3({
  username:              process.env.WATSON_USERNAME,
  password:              process.env.WATSON_PASSWORD,
  version_date: '2016-10-19'
});

module.exports = {

 facebook: function(userId, token) {
   console.log('fb')
    graph.get(`${userId}/feed?access_token=${token}`, function(err, res) {
      if(err) console.log(err)
      else console.log(res)
    })
},
  twitter: function(twittername) {
    console.log('tw')
    T.get('search/tweets', { q: `from:${twittername}`, count: 500 }, function(err, data, response) {
      if (err) console.log(err) 
      else console.log(data)
    })
},

  personalityInsights: function (fullString) {
    console.log('ersonality')
    personality_insights.profile({
      text: fullString,
      consumption_preferences: true
    },
    function (err, response) {
      if (err) return err
      else return response
    });
  }
}