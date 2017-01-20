// jshint ignore:start
describe("Test main controller", function() {
  var authentication;
  var $controller;
  var $rootScope;
  var controller;
  var errOcurred;
  beforeAll(function() {
    jasmine.getFixtures().fixturesPath = 'base/app/views/';
  });

  // Before each test load our api.users module
  beforeEach(angular.mock.module('ngRoute'));
  beforeEach(angular.mock.module('restangular'));
  beforeEach(angular.mock.module('clientApp'));

  // Before each te4st set our injected Users factory (_Users_) to our local Users variable
  beforeEach(inject(function(_$rootScope_, _$controller_) {
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    $controller = _$controller_;
  }));

  describe("Test main controller operations", function() {

    beforeEach(inject(function(_$location_, _authentication_) {
      jasmine.getFixtures().clearCache();
      loadFixtures('welcome.html');
      authentication = _authentication_;
      spyOn(authentication, "login").and.callFake(function(data) {
        return {
          then: function(success, error) {
            if (errOcurred)
              error();
            else {
              success();
            }
          }
        };
      });
      $location = _$location_;
      spyOn($location, "path");
      controller = $controller("MainCtrl", {
        $scope: scope,
        $location: $location,
        authentication: authentication
      });
    }));

    it("should verify form exist", function() {
      expect(controller).toBeDefined();
      expect($("#loginForm")).toExist();
      expect(scope.submit).toBeDefined();
      expect($("#loginForm")).toBeVisible();
    });

    it("should not login user", function() {
      errOcurred = true;
      expect(controller).toBeDefined();
      expect(scope.submit).toBeDefined();
      controller.credentials.username = "tester";
      controller.credentials.password = "test"
      expect($("#loginForm")).toExist();
      scope.submit();
      expect(authentication.login).toHaveBeenCalledWith(controller.credentials);
      expect($location.path).not.toHaveBeenCalled();
      expect($("#loginForm")).toBeVisible();
    });

    it("should login user", function() {
      errOcurred = false;
      expect(controller).toBeDefined();
      expect(scope.submit).toBeDefined();
      controller.credentials.username = "tester";
      controller.credentials.password = "test"
      expect($("#loginForm")).toExist();
      scope.submit();
      expect(authentication.login).toHaveBeenCalledWith(controller.credentials);
      expect($location.path).toHaveBeenCalledWith("/profile");
    });
  });
});
// jshint ignore:end
