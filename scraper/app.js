var express = require('express');
var js = require('jsonfile');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var home = 'http://en.wannasurf.com'

var getSpot = function(url){
  if (hasGPS($(this))) {
    url = home + url
    setTimeout(function(){
      console.log('going to ' + url)
      request(url, function(error, response, html){
        var $ = cheerio.load(html);

        var GPS = $('.wanna-item-label-gps').parent().text()
        console.log({
          gps: gps,
          url: url          
        })
        pushToJSON({
          gps: gps,
          url: url          
        })        
      })
    }, 5000)
  }
}

var getZone = function(url){
  url = home + url
  setTimeout(function(){
    console.log('going to ' + url)
    request(url, function(error, response, html){
      var $ = cheerio.load(html);
      $('.wanna-item').filter(function(){
        var data = $(this);
        if (data.text() === "Zones") {
          data.next().find('a.wanna-tabzonespot-item-title').filter(function(){
            getZone(link.attr('href'))
          })
        } else if (data.text() === "Surf Spots"){
          data.next().find('a.wanna-tabzonespot-item-title').filter(function(){
            getSpot(link.attr('href'))
          })        
        }
        

      })
    })
  }, 5000)
};

var pushToJSON = function(spot){
  js.readFile('./output.json', function(err, json){
    json.push(spot)
    js.writeFile('./output.json', json, function(){})
  })
};

var hasGPS = function(link){
  var a = link.parent().next().next().children().length
  return a
};

app.get('/scrape', function(req, res){

  var url = home;

  request(url, function(error, response, html){
    var $ = cheerio.load(html);

    $('#wanna-continent option').filter(function(){
      // filter out description options
      if (!$(this).attr('value')) return false

      var url = home + $(this).attr('value')

      setTimeout(function(){
        console.log('going to ' + url)
        request(url, function(error, response, html){
          var $ = cheerio.load(html)

          $('.wanna-sublink.countryWithSpot').filter(function(){
            var url = $(this).attr('href')
            getZone(url)
          })
        })
      }, 5000)

    })



    res.send('Check your console!')

  })

})

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;