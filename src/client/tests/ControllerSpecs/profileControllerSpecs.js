// jshint ignore:start
describe("Test profile controller", function() {
  var authentication;
  var $controller;
  var $rootScope;
  var controller;
  var $location;
  var deviceService;
  var meanData;
  var compile;
  beforeAll(function() {
    jasmine.getFixtures().fixturesPath = 'base/app/views/';
  });

  // Before each test load our api.users module
  beforeEach(angular.mock.module('ngRoute'));
  beforeEach(angular.mock.module('restangular'));
  beforeEach(angular.mock.module('clientApp'));

  // Before each te4st set our injected Users factory (_Users_) to our local Users variable
  beforeEach(inject(function(_$rootScope_, _$controller_, _$compile_) {
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    $controller = _$controller_;
    compile = _$compile_;
  }));

  describe("Test main controller operations", function() {
    var userData = {
      data: {
        name: "Tester McTester",
        username: "tester",
        profileImage: "img",
        _id: 1234
      }
    };
    var deviceData = {
      data: [{
        deviceID: 1234,
        owner: "tester",
        outlets: [{
          outletNumber: 0,
          isOn: 0,
          nickname: "test outlet",
          wattage: 487,
          elapsedTimeOn: 15
        }]
      }]
    };
    beforeEach(inject(function(_$location_, _meanData_, _authentication_, _deviceService_) {
      authentication = _authentication_;
      meanData = _meanData_;
      deviceService = _deviceService_;
      spyOn(authentication, "logout");
      spyOn(authentication, "deleteAccount");
      spyOn(authentication, "changePassword");
      spyOn(authentication, "changeProfilImg");
      spyOn(deviceService, "getDevices").and.returnValue({
        then: function(callback, error) {
          callback(deviceData);
        }
      });
      spyOn(deviceService, "addDevice");
      spyOn(meanData, "getProfile").and.returnValue({
        then: function(callback) {
          callback(userData);
        }
      });
      $location = _$location_;
      spyOn($location, "path");
      controller = $controller("ProfileCtrl", {
        $scope: scope,
        $location: $location,
        meanData: meanData,
        authentication: authentication,
        deviceService: deviceService
      });
    }));

    beforeEach(function() {
      jasmine.getFixtures().clearCache();
      loadFixtures("profile.html");
    });

    it("verify operations exist", function() {
      expect(compile).toBeDefined();
      expect(controller).toBeDefined();
      expect(scope).toBeDefined();
      expect($location).toBeDefined();
      expect(meanData).toBeDefined();
      expect(authentication).toBeDefined();
      expect(deviceService).toBeDefined();
    });

    it("verify modals act appropiately", function() {
    expect($("#changePassModal")).not.toBeVisible();
      $("#accountDropdown").click()
      $("#openChangePassModal").click();
      expect($("#changePassModal")).toBeVisible();
    });

  });
});
// jshint ignore:end
