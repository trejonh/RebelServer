// jshint ignore:start
describe("Test authentication service", function() {
  var authentication;

  // Before each test load our api.users module
  beforeEach(angular.mock.module('clientApp'));

  // Before each test set our injected Users factory (_Users_) to our local Users variable
  beforeEach(inject(function(_authentication_) {
    authentication = _authentication_;
  }));
  describe("Test methods exist", function() {
    it("should test authentication is defined", function() {
      expect(authentication).toBeDefined();
      expect(authentication.saveToken).toBeDefined();
      expect(authentication.getToken).toBeDefined();
      expect(authentication.isLoggedIn).toBeDefined();
      expect(authentication.currentUser).toBeDefined();
      expect(authentication.register).toBeDefined();
      expect(authentication.login).toBeDefined();
      expect(authentication.changeProfilImg).toBeDefined();
      expect(authentication.logout).toBeDefined();
      expect(authentication.deleteAccount).toBeDefined();
      expect(authentication.changePassword).toBeDefined();
    });
  });
});
// jshint ignore:end
