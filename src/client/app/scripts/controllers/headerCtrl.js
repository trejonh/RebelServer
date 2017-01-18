"use strict";

angular.module('clientApp')
  .controller('HeaderCtrl', function($scope, $location, $interval, authentication) {
    var header = this; // jshint ignore:line
    $scope.loggedIn = !authentication.isLoggedIn(); //true == hidden, false==visible
    $interval(function() {
      $scope.loggedIn = !authentication.isLoggedIn();
    }, 5000);
    $scope.logout = function() {
      $scope.loggedIn = true; //true == hidden, false==visible
      authentication.logout();
      $location.path("/");
    };
  });
