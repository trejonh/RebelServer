// jshint ignore:start
describe("Test register controller", function() {
  var authentication;
  var $controller;
  var $rootScope;
  var RegisteruserCtrl;
  var controller;

  // Before each test load our api.users module
  beforeEach(angular.mock.module('ngRoute'));
  beforeEach(angular.mock.module('restangular'));
  beforeEach(angular.mock.module('clientApp'));

  // Before each te4st set our injected Users factory (_Users_) to our local Users variable
  beforeEach(inject(function(_$rootScope_, _$controller_) {
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    $controller = _$controller_;
    controller = $controller('RegisteruserCtrl', {
      $scope: scope
    });
  }));

  describe("Test controller exist", function() {
    it("should test controllers is defined", function() {
      expect(controller).toBeDefined();
    });
  });

  describe("Test registration controller operations", function() {
    var userDetails = {
      name: "Tester McTester",
      username: "tester",
      email: "tester@test.com",
      password: "test",
      confirmPassword: "test",
      profileImage: undefined
    };
    beforeEach(inject(function(_$location_, _authentication_) {
      authentication = _authentication_;
      spyOn(authentication, "register").and.callFake(function() {
        return {then: function(callback){callback();}};
      });
      $location = _$location_;
      spyOn($location, "path");
      controller = $controller("RegisteruserCtrl", {
        $scope: scope,
        $location: $location,
        authentication: authentication
      });
    }));

    it("should register user", function() {
      expect($location).toBeDefined();
      expect(scope.submit).toBeDefined();
      expect(controller).toBeDefined();
      controller.credentials = userDetails;
      scope.submit();
      userDetails.profileImage = controller.credentials.profileImage;
      expect(authentication.register).toHaveBeenCalledWith(userDetails);
      expect($location.path).toHaveBeenCalledWith("/profile");
    });

    it("should not register user due to lack of password", function() {
      expect($location).toBeDefined();
      expect(scope.submit).toBeDefined();
      expect(controller).toBeDefined();
      userDetails.password = "";
      controller.credentials = userDetails;
      scope.submit();
      expect(authentication.register).not.toHaveBeenCalled();
    });

    it("should not register user due to lack of username", function() {
      expect($location).toBeDefined();
      expect(scope.submit).toBeDefined();
      expect(controller).toBeDefined();
      userDetails.username = "";
      controller.credentials = userDetails;
      scope.submit();
      expect(authentication.register).not.toHaveBeenCalled();
    });

    it("should not register user due to lack of name", function() {
      expect($location).toBeDefined();
      expect(scope.submit).toBeDefined();
      expect(controller).toBeDefined();
      userDetails.name = "";
      controller.credentials = userDetails;
      scope.submit();
      expect(authentication.register).not.toHaveBeenCalled();
    });
  });
});
// jshint ignore:end
