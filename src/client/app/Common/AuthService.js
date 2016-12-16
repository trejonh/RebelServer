"use strict";
/* jshint ignore:start */
(function() {

  angular
    .module('clientApp')
    .service('authentication', authentication);

  authentication.$inject = ['$http', '$window'];

  function authentication($http, $window) { // jshint ignore:line

    var saveToken = function(token) {
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
      return $http.post('http://' + window.location.hostname + ':3000/register', user).success(function(data) {
        saveToken(data.token);
      }).error(function(err) {
        console.log(err);

      });
    };

    var login = function(user) {
      return $http.post('http://' + window.location.hostname + ':3000/login', user).success(function(data) {
        saveToken(data.token);
      }).error(function(err) {
        console.log(err);
      });
    };

    var changeProfilImg = function(file) {
      $http.put('http://' + window.location.hostname + ':3000/profile',file)
      .success(function(data){
        console.log(data);
      }).error(function(err){
        if(err)
          console.log(err);
      });
    };

    var logout = function() {
      $window.localStorage.removeItem('mean-token');
    };

    var deleteAccount = function(userData) {
      return $http.delete('http://' + window.location.hostname + ':3000/profile',{params: {_id:userData}}).success(function(data) {
        console.log("account deleted");
      }).error(function(err) {
        if(err)
          console.log(err);
      });
    };

    var changePassword = function(passwords){
      return $http.put('http://' + window.location.hostname + ':3000/profile',passwords).success(function(data) {
        console.log("password changed");
      }).error(function(err) {
        if(err)
          console.log(err);
      });
    };

    return {
      currentUser: currentUser,
      saveToken: saveToken,
      getToken: getToken,
      isLoggedIn: isLoggedIn,
      register: register,
      login: login,
      changeProfilImg: changeProfilImg,
      logout: logout,
      deleteAccount: deleteAccount,
      changePassword: changePassword
    };
  };
})();
/* jshint ignore:end*/