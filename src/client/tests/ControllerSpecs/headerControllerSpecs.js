// jshint ignore:start
describe("Test header controller", function() {
  var authentication;
  var $controller;
  var $rootScope;
  var controller;
  var $interval;
  var loggedIn;
  beforeAll(function(){
    jasmine.getFixtures().fixturesPath = 'base/app/views/';
    loadFixtures('navbar.html');
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

  describe("Test header controller operations", function() {

    beforeEach(inject(function(_$location_, _$interval_ ,_authentication_) {
      authentication = _authentication_;
      $interval = _$interval_;
      spyOn(authentication, "isLoggedIn").and.callFake(function(){
        return loggedIn;
      });
      $location = _$location_;
      spyOn($location, "path");
      controller = $controller("HeaderCtrl", {
        $scope: scope,
        $location: $location,
        $interval: $interval,
        authentication: authentication
      });
    }));

    it("should show logout button", function() {
      loggedIn = true;
      expect(controller).toBeDefined();
      expect(scope.loggedIn).toBeDefined();
      expect(scope.logout).toBeDefined();
      expect(authentication.isLoggedIn).toHaveBeenCalled();
      expect(scope.loggedIn).toEqual(loggedIn);
      expect($("#logoutBtn")).toBeVisible();
    });

    it("should hide logout button", function() {
      loggedIn = false;
      expect(controller).toBeDefined();
      expect(scope.loggedIn).toBeDefined();
      expect(scope.logout).toBeDefined();
      expect(authentication.isLoggedIn).toHaveBeenCalled();
      expect(scope.loggedIn).toEqual(loggedIn);
      expect($("#logoutBtn")).not.toBeVisible();
    });

    it("should logout", function() {
      loggedIn = true;
      expect(controller).toBeDefined();
      expect(scope.loggedIn).toBeDefined();
      expect(scope.logout).toBeDefined();
      expect(authentication.isLoggedIn).toHaveBeenCalled();
      scope.logout();
      expect(scope.loggedIn).toEqual(loggedIn);
      expect($location.path).toHaveBeenCalledWith("/");
      expect($("#logoutBtn")).not.toBeVisible();
    });
  });
});
// jshint ignore:end
