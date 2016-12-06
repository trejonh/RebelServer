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
      .when('/mySmartDevices', {
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
      .when('/particleTest', {
        templateUrl: 'views/particleTest.html',
        controller: 'ParticleTestCtrl',
        controllerAs: 'particle'
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
      if ($location.path() === '/profile' && !authentication.isLoggedIn()) {
        $rootScope.lgBtn = {
          display: "none"
        };
        $location.path('/'); // jshint ignore:line
      }
    });
    if (authentication.isLoggedIn() || $location.path() === "/profile") {
      $rootScope.lgBtn = {
        display: "inline-block"
      };
    }
    $rootScope.logout = function() {
      authentication.logout();
      $rootScope.lgBtn = {
        display: "none"
      };
      $location.path('/'); // jshint ignore:line
    };
  });
