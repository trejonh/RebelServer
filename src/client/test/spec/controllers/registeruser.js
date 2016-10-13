'use strict';

describe('Controller: RegisteruserCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var RegisteruserCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RegisteruserCtrl = $controller('registerUser', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RegisteruserCtrl.awesomeThings.length).toBe(3);
  });
});
