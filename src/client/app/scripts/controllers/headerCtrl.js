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
    $scope.notifications = [];
    header.notifications = 0;
    if (authentication.isLoggedIn()) {
      deviceService.getNotifications(authentication.currentUser()._id).then(function(data) {
        header.notifications = data.data.notifications;
      }, function error(err) {
        console.log(err);
      });
    }
    $scope.notifier = function(notification) {
      if (notification.passedOrFail.includes("success")) {
        return {
          'background-color': '#dff0d8;',
          'color': '#3c763d'
        };
      } else {
        return {
          'background-color': '#f2dede;',
          'color': '#a94442'
        };
      }
    };
    $scope.loggedIn = !authentication.isLoggedIn(); //true == hidden, false==visible
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
      deviceService.getNotifications(authentication.currentUser()._id).then(function(data) {
        $scope.notifications = data.data.notifications;
        header.notifications = $scope.notifications.length;
      }, function error(err) {
        console.log(err);
      });
    }, 5000);
    $scope.logout = function() {
      $scope.loggedIn = true; //true == hidden, false==visible
      authentication.logout();
      bind();
      $location.path("/");
    };
  });
