define([
  '../../js/routers/router',
  '../../js/views/login',
  '../../js/models/user'
  ], function (
    Router,
    Login,
    User
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

    it('should have a login method', function() {
      expect(router).toBeDefined();
      expect(router.login).toBeDefined();
    });
    describe("Login method", function() {
      it("should create a new user", function() {
        // router.login();
        expect(router.login()).toEqual(User);
      });

    });
  });

});