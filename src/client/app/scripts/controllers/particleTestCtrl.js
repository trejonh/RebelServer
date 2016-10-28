'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RegisteruserCtrl
 * @description
 * # RegisteruserCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ParticleTestCtrl', function($scope,$sce,$interval,particleServ) {
    var particle = this;
    particle.message = {};
    particle.url="";
    particleServ.getDeviceStatus()
      .success(function(data){
        particle.message = data;
        //$scope.message = data.message;
        particle.url = "https://api.particle.io/v1/devices/"+data.deviceID+"/led?access_token="+data.accessToken;
      })
      .error(function(err){
        console.log(err);
      });
      $scope.trustSrc = function(src){
        return $sce.trustAsResourceUrl(src);
      };
    $interval(function () {
      particleServ.getDeviceStatus()
        .success(function(data){
          if(data === null || data.message === "" || data.message === undefined){
            $scope.message = "Message Deleted";
          }else{
            $scope.message = "Message Recieved at: "+data.date+" it is: "+data.message;
          }
        })
        .error(function(err){
          console.log(err);
        });
    }, 2000);
  });
