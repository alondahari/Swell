define([
  '/app/js/routers/router.js'
  ], function (
    Router
  ) {

  describe('test suite', function() {
    it('should run', function() {
      expect(true).toBe(true);
    });
  });

  describe('Router', function() {
    var router;
    beforeEach(function(){
      router = new Router();
      
    });

    it("routes has all the right routes", function() {
      expect(router.routes['']).toEqual('login');
      expect(router.routes['location']).toEqual('location');
      expect(router.routes['spot/:id']).toEqual('spot');
      expect(router.routes['submit-rating']).toEqual('submitRating');
      expect(router.routes['init-database']).toEqual('initDatabase');
    });

    describe("Login method", function() {
      var login;
      it("should create a new view on the wrapper", function() {
        login = router.login();
        expect(login.$el.selector).toEqual('.wrapper');
      });
      it("should instantiate a view with a collection", function() {
        expect(login.collection).toEqual(jasmine.any(Backbone.Collection));
      });
    });

    describe("location method", function() {
      var location;
      it("should create a new view on the wrapper", function() {
        location = router.location();
        expect(location.$el.selector).toEqual('.wrapper');
      });
      it("should instantiate a view with a collection", function() {
        expect(location.collection).toEqual(jasmine.any(Backbone.Collection));
      });
    });

    describe("spot method", function() {
      var spot;
      it("should create a new view on the wrapper", function() {
        spot = router.spot('spot-id');
        expect(spot.id).toEqual('spot-id');
      });
      it("should instantiate a view with a collection", function() {
        expect(spot.collection).toEqual(jasmine.any(Backbone.Collection));
        
      });
    });

  });

});