'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RegisteruserCtrl
 * @description
 * # RegisteruserCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ParticleTestCtrl', function($scope,$sce,$timeout,particleServ) {
    var particle = this;
    particle.message = {};
    particle.url="";
    particleServ.getDeviceStatus()
      .success(function(data){
        particle.message = data;
        particle.url = "https://api.particle.io/v1/devices/"+data.deviceID+"/led?access_token="+data.accessToken;
      })
      .error(function(err){
        console.log(err);
      });
      $scope.trustSrc = function(src){
        return $sce.trustAsResourceUrl(src);
      };
    $timeout(function () {
      particleServ.getDeviceStatus()
        .success(function(data){
          console.log("in timoeout");
          console.log(data);
          $scope.message = data.message;
        })
        .error(function(err){
          console.log(err);
        });
    }, 5000);
  });
