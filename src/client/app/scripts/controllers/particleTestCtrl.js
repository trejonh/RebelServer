'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RegisteruserCtrl
 * @description
 * # RegisteruserCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ParticleTestCtrl', function($scope,$sce,particleServ) {
    var particle = this;
    particle.message = {};
    //particle.url = "https://api.particle.io/v1/devices/"
    particleServ.getDeviceStatus()
      .success(function(data){
        particle.message = data;
        $scope.actionUrl = $sce.trustAsResourceURL("https://api.particle.io/v1/devices/"+particle.message.deviceID+"/led?access_token="+particle.message.accessToken);
      })
      .error(function(err){
        console.log(err);
      });
  });
