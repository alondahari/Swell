var express = require('express');
var js = require('jsonfile');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var _ = require('underscore');
var app     = express();
var home = 'http://en.wannasurf.com'
var output = []
var delay = 0
var tally = 0

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

var capitalize = function(str){
  var arr = str.split('')
  arr[0] = arr[0].toUpperCase()
  return arr.join('')
}

var formatUrl = function(spot){
  try {
    var newUrl = spot.url.replace(/_s_/g, "'s ")
    var cleanUrl = newUrl.replace(/_/g, ' ')
    var obj
    var arr = cleanUrl.split('/')
    switch(arr.length) {
      case 6:
        obj = {
          continent: arr[2],
          country: arr[3],
          spot: capitalize(arr[4]),
          gps: spot.gps
        }
        break;
      case 7:
        obj = {
          continent: arr[2],
          country: arr[3],
          zone: arr[4],
          spot: capitalize(arr[5]),
          gps: spot.gps
        }
        break;
      case 8:
        obj = {
          continent: arr[2],
          country: arr[3],
          state: arr[4],
          zone: arr[5],
          spot: capitalize(arr[6]),
          gps: spot.gps
        }
        break;
      default:
        obj = spot
    }
    return obj
  } catch (err) {
    console.log(err)
    return url
  }
};

formatAllUrls = function(file){
  js.readFile('./' + file + '.json', function(err, json){

    var data = json.map(formatUrl)

    js.writeFile('./output.json', data, function(){
      console.log('done!');
    })
  })
}

// formatAllUrls('North_America')

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
    js.writeFile('./output.json', json, function(){
      if (json.length === tally){
        console.log('done!');
        process.exit()
      }
    })
  })
}

var hasGPS = function(link){
  return link.parent().next().next().children().length
};

var tallySpots = function(str){
  var num = parseInt(str.split('(')[1].split(')')[0])
  tally += num
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
          tallySpots(data.next().find('th').first().text())
          data.next().find('a.wanna-tabzonespot-item-title').filter(function(){
            if (hasGPS($(this))) {
              getSpot($(this).attr('href'))
            } else {
              pushToJSON({
                url: $(this).attr('href')          
              })
            }
          })        
        }
        

      })
    })
  }, delay)
};

var tallyCountry = function(url){
  var fullUrl = home + url
  request(fullUrl, function(error, response, html){
    if (error) {
      console.log(error);
      tallyCountry(url)
      return
    }
    var $ = cheerio.load(html);
    $('.wanna-item').filter(function(){
      var data = $(this);
      if (data.text() === "Zones") {
        data.next().find('a.wanna-tabzonespot-item-title').filter(function(){
          tally += $(this).parent().next().text()
        })
      } else if (data.text() === "Surf Spots"){
        tallySpots(data.next().find('th').first().text())       
      }
      

    })
  })
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
        tallyCountry(url)
        getZone(url)
      })
    })

})

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;