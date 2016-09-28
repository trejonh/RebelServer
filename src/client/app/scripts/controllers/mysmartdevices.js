'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MysmartdevicesCtrl
 * @description
 * # MysmartdevicesCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MysmartdevicesCtrl', function($scope, Users) {
    $scope.users = Users.getList().$object;
  });
