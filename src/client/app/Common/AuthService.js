"use strict";
/* jshint ignore:start */
(function() {

  angular
    .module('clientApp')
    .service('authentication', authentication);

  authentication.$inject = ['$http', '$window'];

  function authentication($http, $window) { // jshint ignore:line

    var saveToken = function(token) {
      console.log(token);
      $window.localStorage['mean-token'] = token;
    };

    var getToken = function() {
      return $window.localStorage['mean-token'];
    };

    var isLoggedIn = function() {
      var token = getToken();
      var payload;

      if (token !== null && token !== undefined) {
        payload = token.split('.')[1];
        payload = $window.atob(payload); //atob
        payload = JSON.parse(payload);

        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };

    var currentUser = function() {
      if (isLoggedIn()) {
        var token = getToken();
        var payload = token.split('.')[1];
        payload = $window.atob(payload); //atob
        payload = JSON.parse(payload);
        return {
          username: payload.username,
          name: payload.name
        };
      }
    };

    var register = function(user) {
      return $http.post('http://localhost:3000/register', user).success(function(data) {
        console.log("loggin data");
        console.log(data);
        saveToken(data.token);
      }).error(function(err) {
        console.log(err);

      });
    };

    var login = function(user) {
      return $http.post('http://localhost:3000/login', user).success(function(data) {
        saveToken(data.token);
      });
    };

    var logout = function() {
      $window.localStorage.removeItem('mean-token');
    };

    return {
      currentUser: currentUser,
      saveToken: saveToken,
      getToken: getToken,
      isLoggedIn: isLoggedIn,
      register: register,
      login: login,
      logout: logout
    };
  };
})();
/* jshint ignore:end*/
