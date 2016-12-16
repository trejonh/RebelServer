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
    RestangularProvider.setBaseUrl("http://" + window.location.hostname + ":3000");
    $routeProvider
      .when('/', {
        templateUrl: 'views/welcome.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
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
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/mydevices/:deviceID/stats', {
        templateUrl: 'views/stats.html',
        controller: 'StatsCtrl',
        controllerAs: 'stats'
      })
      .when('/mydevices', {
        templateUrl: 'views/mydevices.html',
        controller: 'MydevicesCtrl',
        controllerAs: 'mydevices'
      })
      .otherwise({
        redirectTo: '/'
      });
  }).directive('fileModel', ['$parse', function($parse) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function() {
          scope.$apply(function() {
            modelSetter(scope, element[0].files[0]);
          });
        });
      }
    };
  }]).factory("UsersRestangular", function(Restangular) {
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
      var autheRequiredPath = $location.path() === '/profile' || $location.path() === '/mydevices';
      if (autheRequiredPath && !authentication.isLoggedIn()) {
        $location.path('/'); // jshint ignore:line
      }
    });
  });
