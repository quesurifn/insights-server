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
     var arr = []
   return new Promise(resolver)
     function resolver(resolve, reject) {
       console.log('called')
      graph.get(`${userId}/feed?access_token=${token}`, {limit: 500}, function(err, res) {
        console.log(res || err)
         if (err) {
           console.log(err)
         }
          if(res.paging && res.paging.next) {
              graph.get(res.paging.next, function(err2, res2) {
                
                if(res2.paging && res2.paging.next) {
                  graph.get(res2.paging.next, function(err3, res3) {
             


                res.data.forEach(function(e) {
                  if (e.hasOwnProperty('message')) {
                    arr.push(e.message) 
                  } else if (e.hasOwnProperty('story')) {
                    arr.push(e.story)
                  } else {
                    console.log('something is not here')
                  }
                }) 
                
                res2.data.forEach(function(e) {
                  if (e.hasOwnProperty('message')) {
                  arr.push(e.message) 
                  } else if (e.hasOwnProperty('story')) {
                    arr.push(e.story)
                  } else {
                    console.log('something is not here')
                  }
                })
                
                res3.data.forEach(function(e) {
                  if (e.hasOwnProperty('message')) {
                  arr.push(e.message) 
                  } else if (e.hasOwnProperty('story')) {
                    arr.push(e.story)
                  } else {
                    console.log('something is not here')
                  }
                })

                return resolve(arr.toString())

              })

                } // if 
          
              })

            } // if
            
        
      })
   }  
  
  },
  twitter: function(twittername) {
    return new Promise(resolver)
      
    function resolver(resolve, reject) {
      var arr = []
      T.get('search/tweets', { q: `from:${twittername}`, count: 500 }, function(err, data, response) {
        if (err) {
          return reject(err)
          console.log(err)
        } else {
          data.statuses.forEach(function(e) {
          arr.push(e.text)
        })
        
      }
      return resolve(arr.toString())
    })
  }

    
   
 
},
personalityInsights: function (fullString) { 
  return new Promise(resolver)
  function resolver(resolve, reject) {
    personality_insights.profile({
        text: fullString,
        consumption_preferences: true
      },
      function (err, response) {
        if (err) {return reject(err)}
        else return resolve(response)
      });
    }
  }
}