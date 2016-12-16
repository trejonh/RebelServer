"use strict";

angular.module('clientApp')
  .controller('HeaderCtrl', function($scope, $location, $interval, authentication) {
    var header = this; // jshint ignore:line
    var checkedIfLoggedIn = $interval(function() { //jshint ignore:line
      if (authentication.isLoggedIn()) {
        $scope.loggedIn = false;
      } else {
        $scope.loggedIn = true;
      }
    }, 5000);
    $scope.logout = function() {
      authentication.logout();
      $location.path("/");
    };
  });
