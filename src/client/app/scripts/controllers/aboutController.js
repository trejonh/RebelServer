'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RegisteruserCtrl
 * @description
 * # RegisteruserCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AboutCtrl', function($scope,$location,meanData) {
    var profile = this;
    profile.user = {};
    meanData.getProfile()
      .success(function(data) {
        profile.user = data;
      })
      .error(function(e) {
        console.log(e);
      });
      $scope.logout = function(){
        console.log("loggin out");
      };
  });
