'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MydevicesCtrl
 * @description
 * # MydevicesCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MydevicesCtrl', function ($scope, meanData, deviceService) {
    var mydevice = this;
    mydevice.user = {};
    $scope.devices = [];
    meanData.getProfile()
      .success(function(data) {
        mydevice.user = data;
        deviceService.getDevices(mydevice.user.username).success(function(data) {
          $scope.devices = data;
          console.log($scope.devices);
        }).error(function(err) {
          if (err) {
            console.log(err);
          }
        });
      })
      .error(function(e) {
        console.log(e);
      });
    $scope.outletsOn = $scope.devices.outlets.forEach(function(outlet) {
      var numOn = 0;
      if (outlet.isOn === 1) {
        numOn++;
      }
      return numOn;
    });
    console.log($scope.outletsOn);
    $scope.totalPowerDrawn = $scope.devices.outlets.forEach(function(outlet) {
      var totalWattage = 0;
      if (outlet.isOn === 1) {
        totalWattage += outlet.wattage;
      }
      return totalWattage;
    });
  });
