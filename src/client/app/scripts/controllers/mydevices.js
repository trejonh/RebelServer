'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MydevicesCtrl
 * @description
 * # MydevicesCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MydevicesCtrl', function($scope, $location, meanData, deviceService) {
    var mydevice = this;
    mydevice.user = {};
    $scope.devices = [];
    meanData.getProfile()
      .then(function(data) {
        mydevice.user = data.data;
        deviceService.getDevices(mydevice.user.username).then(function(data) {
          $scope.devices = data.data;
        }, function error(err) {
          if (err) {
            console.log(err);
          }
        });
      }, function error(e) {
        console.log(e);
      });
    $scope.outletsOn = function(device) {
      var toRet = 0;
      device.outlets.forEach(function(outlet) {
        if (outlet.isOn === 1) {
          toRet++;
        }
      });
      return toRet;
    };

    $scope.totalPowerDrawn = function(device) {
      var toRet = 0;
      device.outlets.forEach(function(outlet) {
        if (outlet.isOn === 1) {
          toRet += outlet.currentWattage;
        }
      });
      return toRet;
    };

    $scope.toStatPage = function(device) {
      $location.path("/mydevices/" + device.deviceID + "/stats");
    };

  });
