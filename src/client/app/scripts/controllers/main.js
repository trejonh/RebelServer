'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function ($scope, $location) {
    $scope.submit = function(){
      /*  $rootScope.username = $scope.username;//$rootscope is global
        $rootScope.password = $scope.password;*/
        /*
        $rootScope.isLoggedIn = true;
        */
    };
  });
