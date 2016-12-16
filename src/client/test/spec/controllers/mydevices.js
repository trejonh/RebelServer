'use strict';

describe('Controller: MydevicesCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var MydevicesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MydevicesCtrl = $controller('MydevicesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MydevicesCtrl.awesomeThings.length).toBe(3);
  });
});
