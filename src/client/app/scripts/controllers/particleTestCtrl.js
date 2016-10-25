'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RegisteruserCtrl
 * @description
 * # RegisteruserCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ParticleTestCtrl', function($scope,particleServ) {
    var particle = this;
    particle.message = {};
    //particle.url = "https://api.particle.io/v1/devices/"
    particleServ.getDeviceStatus()
      .success(function(data){
        particle.message = data;
      })
      .error(function(err){
        console.log(err);
      });
      $scope.toggle = function(){
        console.log($scope.ledState);
        particleServ.toggle(particle.message.deviceID,particle.message.accessToken);
      };
  });
