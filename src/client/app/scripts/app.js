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
  ]).config(function($routeProvider, RestangularProvider) {
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
      .when('/profile', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'profile'
      })
      .otherwise({
        redirectTo: '/'
      });
  }).factory("UsersRestangular", function(Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setRestangularFields({
        id: "_id"
      });
    });
  })
  .factory("Users", function(UsersRestangular) {
    return UsersRestangular.service("registeredUsers");
  })
  .run(function($rootScope, $location, authentication) {
    $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) { // jshint ignore:line
      if ($location.path() === '/profile' && !authentication.isLoggedIn())
        $location.path('/');// jshint ignore:line
    });
  });
/*.run(function($rootScope, $location, authentication) {
    $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) { // jshint ignore:line
      if ($location.path() === '/profile' && !authentication.isLoggedIn())
        $location.path('/');
    });
  });*/
