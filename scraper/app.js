var express = require('express');
var js = require('jsonfile');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var home = 'http://en.wannasurf.com'
var output = []
var delay = 0

formatGPS = function (gps) {
  try {
    var coords = gps.substr(gps.indexOf('Lat'))
    var digits = coords.match(/\d+/g)
    var latSign = coords.match(/N/g) ? '' : '-'
    var longSign = coords.match(/E/g) ? '' : '-'
    var construct = latSign + digits[0] + '.' + digits[1] + digits[2] + ',' + longSign + digits[3] + '.' + digits[4] + digits[5]
    return construct    
  } catch (err) {
    console.log(err)
    return gps
  }
}

var fixJSONFile = function (spot) {
  fs.readFile('./output.json', 'utf-8' ,function(err, str){
    var end = str.indexOf(']')
    if (end) {
      var newData = str.substring(0, end + 1)
      fs.writeFile('./output.json', newData, function(){
        console.log('fixed!')
        pushToJSON(spot)
      })
    } else {
      console.log(err);
      process.exit()
    }
  })
}

var pushToJSON = function(spot){
  js.readFile('./output.json', function(err, json){
    if (err) {
      console.log('error:', err);
      fixJSONFile(spot)
      return
    }
    json.push(spot)
    js.writeFile('./output.json', json, function(){})
  })
}

var hasGPS = function(link){
  return link.parent().next().next().children().length
};

var getSpot = function(url){
  var fullUrl = home + url
  delay += 1000
  setTimeout(function(){
    console.log('getting spot ' + fullUrl)
    request(fullUrl, function(error, response, html){
      if (error) {
        console.log(error);
        getSpot(url)
        return
      }
      var $ = cheerio.load(html);

      var gps = $('.wanna-item-label-gps').parent().text()

      console.log({
        gps: gps,
        url: url          
      })
      pushToJSON({
        gps: formatGPS(gps),
        url: url          
      })        
    })
  }, delay)
}

var getZone = function(url){
  delay += 1000
  var fullUrl = home + url
  setTimeout(function(){
    console.log('going to ' + fullUrl)
    request(fullUrl, function(error, response, html){
      if (error) {
        console.log(error);
        getZone(url)
        return
      }
      var $ = cheerio.load(html);
      $('.wanna-item').filter(function(){
        var data = $(this);
        if (data.text() === "Zones") {
          data.next().find('a.wanna-tabzonespot-item-title').filter(function(){
            getZone($(this).attr('href'))
          })
        } else if (data.text() === "Surf Spots"){
          data.next().find('a.wanna-tabzonespot-item-title').filter(function(){
            if (hasGPS($(this))) {
              getSpot($(this).attr('href'))
            }
          })        
        }
        

      })
    })
  }, delay)
};

app.get('/scrape/all', function(req, res){

  var url = home;


  request(url, function(error, response, html){
    var $ = cheerio.load(html);

    $('#wanna-continent option').filter(function(){
      // filter out description options
      if (!$(this).attr('value')) return false

      var url = home + $(this).attr('value')
      delay += 1000
      setTimeout(function(){
        console.log('going to ' + url)
        request(url, function(error, response, html){
          var $ = cheerio.load(html)

          $('.wanna-sublink.countryWithSpot').filter(function(){
            var delay = 0
            var url = $(this).attr('href')
            getZone(url)
          })
        })
      }, delay)

    })



    res.send('Check your console!')

  })

})

app.get('/scrape/:continent', function(req, res){


  var url = home + '/spot/' + req.params.continent + '/index.html'

    console.log('going to ' + url)
    request(url, function(error, response, html){
      var $ = cheerio.load(html)

      $('.wanna-sublink.countryWithSpot').filter(function(){
        var url = $(this).attr('href')
        getZone(url)
      })
    })

})

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;