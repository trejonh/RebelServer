'use strict';

describe('Controller: MysmartdevicesCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var MysmartdevicesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MysmartdevicesCtrl = $controller('mySmartDevices', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MysmartdevicesCtrl.awesomeThings.length).toBe(3);
  });
});
