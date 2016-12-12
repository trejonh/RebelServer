'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RegisteruserCtrl
 * @description
 * # RegisteruserCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MyDeviceCtrl', function($scope, $location, meanData, deviceService) {
    var mydevice = this;
    console.log("in my device ctrl");
    $scope.myOwnedDevices = [];
    meanData.getProfile()
      .success(function(data) {
        console.log("got user data");
        console.log(data);
        deviceService.getDevices(data.username).success(function(deviceData) {
          console.log("got device data");
          $scope.myOwnedDevices = deviceData;
          console.log($scope.myOwnedDevices);
        }).error(function(err) {
          if (err) {
            console.log(err);
          }
        });
      })
      .error(function(e) {
        console.log(e);
      });
    /*$scope.outletsOn = $scope.myOwnedDevices.outlets.forEach(function(outlet) {
      var numOn = 0;
      if (outlet.isOn === 1) {
        numOn++;
      }
      return numOn;
    });
    $scope.totalPowerDrawn = $scope.myOwnedDevices.outlets.forEach(function(outlet) {
      var totalWattage = 0;
      if (outlet.isOn === 1) {
        totalWattage += outlet.wattage;
      }
      return totalWattage;
    });*/
  });
