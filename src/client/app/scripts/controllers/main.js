'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function($scope, $location, authentication) {
    var main = this;
    main.credentials = {
      username: "",
      password: ""
    };
    $scope.submit = function() {
      authentication.login(main.credentials).then(function() {
        $location.path("/profile");
      }, function errorCallback() {
        $("#loginFailure").show();// jshint ignore:line
      });
    };
  });