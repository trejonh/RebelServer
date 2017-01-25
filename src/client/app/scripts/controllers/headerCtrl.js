"use strict";

function bind() {
  $("#myDevicesLink").bind('click', function(e) { //jshint ignore:line
    e.preventDefault();
  });
  $("#profileLink").bind('click', function(e) { //jshint ignore:line
    e.preventDefault();
  });
}

function unbind() {
  $("#profileLink").unbind('click'); //jshint ignore:line
  $("#myDevicesLink").unbind('click'); //jshint ignore:line
}

angular.module('clientApp')
  .controller('HeaderCtrl', function($scope, $location, $interval, authentication, deviceService) {
    var header = this; // jshint ignore:line
    header.notifications = {};
    deviceService.getNotifications(authentication.currentUser().username).then(function(data) {
      console.log(data);
    }, function error(err){
      console.log(err);
    });
    $scope.loggedIn = !authentication.isLoggedIn(); //true == hidden, false==visible
    $scope.hasNotifications = false;
    if (authentication.isLoggedIn) {
      unbind();
    } else {
      bind();
    }
    $interval(function() {
      $scope.loggedIn = !authentication.isLoggedIn();
      if (authentication.isLoggedIn) {
        unbind();
      } else {
        bind();
      }
    }, 5000);
    $scope.logout = function() {
      $scope.loggedIn = true; //true == hidden, false==visible
      authentication.logout();
      bind();
      $location.path("/");
    };
  });
