var phantom = require('phantom');
phantom.create(function(ph) {
  return ph.createPage(function(page) {
    return page.open("http://www.google.com", function(status) {

    	page.injectJs('http://en.wannasurf.com/spot/Middle_East/Israel/index.html', function() {
    		return page.evaluate(function(){
    			var links = []
    			$('.wanna-tabzonespot-item-title').each(function(val){
    				console.log(val);
    			})

    		},function(result){

    		})
 
      });

    });
  });
});