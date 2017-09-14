var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
var graph                 = require('fbgraph');
var Twit                  = require('twit')

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

var facebook_config = {
    client_id:           process.env.FB_CLIENT_ID,
    client_secret:       process.env.FB_CLIENT_SECRET, 
}

export function facebook(userId, token) {
    graph.get(`${userId}/feed?access_token=${accessToken}`, function(err, res) {
        return res
    })
}

export function twitter(twittername) {
    T.get('search/tweets', { q: `from:${twittername}`, count: 500 }, function(err, data, response) {
        return data
    })
}

export function personalityInsights(fullString) {
  personality_insights.profile({
    text: fullString,
    consumption_preferences: true
  },
  function (err, response) {
    if (err) return err
    else return response
  });
}