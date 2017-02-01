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
    var notificationsTimer;
    header.myNote = {};
    $scope.saveNotification = function(note) {
      header.myNote = note;
      console.log(header.myNote);
    };
    $scope.notifications = [];
    header.notifications = 0;
    if (authentication.isLoggedIn()) {
      deviceService.getNotifications(authentication.currentUser()._id).then(function(data) {
        $scope.notifications = data.data.notifications;
        header.notifications = $scope.notifications.length;
      }, function error(err) {
        console.log(err);
      });
    }
    $scope.notifier = function(notification) {
      if (notification.passedOrFail.includes("success")) {
        return {
          'background-color': '#dff0d8;',
          'color': '#3c763d;',
          'cursor': 'pointer;'
        };
      } else {
        return {
          'background-color': '#f2dede;',
          'color': '#a94442;',
          'cursor': 'pointer;'
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
    }, 5000);
    notificationsTimer = $interval(function() {
      if (authentication.isLoggedIn()) {
        deviceService.getNotifications(authentication.currentUser()._id).then(function(data) {
          $scope.notifications = data.data.notifications;
          header.notifications = $scope.notifications.length;
        }, function error(err) {
          console.log(err);
        });
      }
    }, 60000);
    $scope.logout = function() {
      $scope.loggedIn = true; //true == hidden, false==visible
      authentication.logout();
      bind();
      $location.path("/");
    };
    $('#notificationModal').on('hidden.bs.modal', function() { //jshint ignore:line
      console.log(header.myNote);
      if (!header.myNote) {
        return;
      }
      if (notificationsTimer) {
        $interval.cancel(notificationsTimer);
      }
      header.myNote._id = authentication.currentUser()._id;
      authentication.removeNote(header.myNote).then(function() {
        notificationsTimer = $interval(function() {
          if (authentication.isLoggedIn()) {
            deviceService.getNotifications(authentication.currentUser()._id).then(function(data) {
              $scope.notifications = data.data.notifications;
              header.notifications = $scope.notifications.length;
            }, function error(err) {
              console.log(err);
            });
          }
        }, 60000);
      }, function error(err) {
        if (err) {
          console.log(err);
        }
      });
    });
  });
