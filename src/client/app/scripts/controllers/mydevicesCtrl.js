'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RegisteruserCtrl
 * @description
 * # RegisteruserCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MyDeviceCtrl', function($scope, $location, $interval, authentication, deviceService) {
    var mydevice = this;
    $scope.myOwnedDevices = {};
    mydevice.user = authentication.currentUser();
    var getDevices = $interval(function(){
    deviceService.getDevices(mydevice.user.username).success(function(data) {
      console.log(data);
      $scope.myOwnedDevices = data;
    }).error(function(err) {
      if (err) {
        console.log(err);
      }
    });

    if($scope.myOwnedDevices){
      $interval.cancel(getDevices);
    }

    },5000);
    $scope.outletsOn = $scope.myOwnedDevices.outlets.forEach(function(outlet){
      var numOn = 0;
      if(outlet.isOn === 1){
        numOn++;
      }
      return numOn;
    });
    $scope.totalPowerDrawn = $scope.myOwnedDevices.outlets.forEach(function(outlet){
      var totalWattage = 0;
      if(outlet.isOn === 1){
        totalWattage += outlet.wattage;
      }
      return totalWattage;
    });
  });
