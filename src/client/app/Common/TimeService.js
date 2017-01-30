"use strict";
/* jshint ignore:start */
(function() {

  angular
    .module('clientApp')
    .service('timeService', timeService);

  //timeService.$inject = ['$http', '$window'];

  function timeService() { // jshint ignore:line

    var currentTimeZone = function() {
      if (!sessionStorage.getItem('timezone')) {
        var tz = jstz.determine() || 'UTC';
        sessionStorage.setItem('timezone', tz.name());
      }
      return sessionStorage.getItem('timezone');
    };

    return {
      currentTimeZone: currentTimeZone
    };
  };
})();
/* jshint ignore:end*/
