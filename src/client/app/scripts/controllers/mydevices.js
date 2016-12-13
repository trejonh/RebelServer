'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MydevicesCtrl
 * @description
 * # MydevicesCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MydevicesCtrl', function($scope, meanData, deviceService) {
    var mydevice = this;
    mydevice.user = {};
    $scope.devices = [];
    meanData.getProfile()
      .success(function(data) {
        mydevice.user = data;
        deviceService.getDevices(mydevice.user.username).success(function(data) {
          $scope.devices = data;
        }).error(function(err) {
          if (err) {
            console.log(err);
          }
        });
      })
      .error(function(e) {
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
          toRet += outlet.wattage;
        }
      });
      return toRet;
    };

  });
