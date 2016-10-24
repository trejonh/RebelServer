'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RegisteruserCtrl
 * @description
 * # RegisteruserCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ParticleTestCtrl', function(particleServ) {
    var particle = this;
    particle.message = {};
    particleServ.getDeviceStatus()
      .success(function(data){
        particle.message = data;
      })
      .error(function(err){
        console.log(err);
      });
  });
