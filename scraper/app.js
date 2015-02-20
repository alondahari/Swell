var express = require('express');
var js = require('jsonfile');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var getZone = function(data){
  var zone = data.text()

  // json.push(zone)

  url = data.attr('href')

  request(url, function(error, response, html){
    $('.wanna-item').filter(function(){
      var data = $(this);

      

    })
  })
};

app.get('/scrape', function(req, res){

  url = 'http://en.wannasurf.com/spot/North_America/USA/California/';

  request(url, function(error, response, html){

    var $ = cheerio.load(html);

    var json = []

    $('.wanna-tabzonespot-item-title').filter(function(){
      var data = $(this);

      

    })

    // $('span.wanna-item-label-gps').parent('p').filter(function(){
    //   var data = $(this);

    //   var gps = data.text();

    //   // var lat = gps.match(/Lat.+\\/)
    //   // var long = gps.match(/Long.+/)[0]

    //   json.gps = gps
    // })
    js.writeFile('./output.json', json, function(err){

      console.log('File successfully written! - Check your project directory for the output.json file');

    })


    // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
    res.send('Check your console!')

  })

})

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;