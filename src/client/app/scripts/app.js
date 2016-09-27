'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
  .module('clientApp', [
    'ngRoute',
    "restangular"
  ])
  .config(function ($routeProvider, RestangularProvider) {
    RestangularProvider.setBaseUrl("http://localhost:3000");
    $routeProvider
      .when('/', {
        templateUrl: 'views/welcome.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/mySmartDevices', {
        /*resolve:{
          "check":function($location){
              if(!$rootScope.isLoggedIn)
                $location.path("/")
          }
        },*/
        templateUrl: 'views/mysmartdevices.html',
        controller: 'MysmartdevicesCtrl',
        controllerAs: 'mySmartDevices'
      })
      .when('/registerUser', {
        templateUrl: 'views/registeruser.html',
        controller: 'RegisteruserCtrl',
        controllerAs: 'registerUser'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
