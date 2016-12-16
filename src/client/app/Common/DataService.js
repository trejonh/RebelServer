"use strict";

(function() {

  angular
    .module('clientApp')
    .service('meanData', meanData);

  meanData.$inject = ['$http', 'authentication'];
  function meanData ($http, authentication) {// jshint ignore:line

    var getProfile = function () {
      return $http.get('http://'+window.location.hostname+':3000/profile', {
        headers: {
          Authorization: 'Bearer '+ authentication.getToken()
        }
      });
    };

    return {
      getProfile : getProfile
    };
  }

})();
