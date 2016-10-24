'use strict';

describe('Controller: MainCtrl', function() {

  var MainCtrl,
    scope,
    $controller,
    $rootScope;


  // load the controller's module
  beforeEach(module('clientApp'));
  // Initialize the controller and a mock scope
  beforeEach(inject(function(_$controller_, _$rootScope_) {
    $rootScope = _$rootScope_;
    $controller = _$controller_;
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
        // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(MainCtrl.awesomeThings.length).toBe(3);
  });
});
