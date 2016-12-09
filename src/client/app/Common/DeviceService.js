"use strict";
/* jshint ignore:start */
(function() {

  angular
    .module('clientApp')
    .service('deviceService', deviceService);

  deviceService.$inject = ['$http', '$window'];

  function deviceService($http, authentication) { // jshint ignore:line
    var devices = [];
    var addDevice = function(device) {
      return $http.put('http://' + window.location.hostname + ':3000/profile', device).success(function(data) {
        console.log(data);
      }).error(function(err) {
        if (err)
          console.log(err);
      });
    };

    var getDevices = function(username, devices) {
      $http.get('http://' + window.location.hostname + ':3000/devices', {
        params: {
          username: username
        }
      }).success(function(data) {
        console.log(data);
        devices = data;
      }).error(function(err) {
        if (err)
          console.log(err);
      });
    };

    return {
      addDevice: addDevice,
      getDevices: getDevices,
      devices: devices
    };
  }

})();
/*jshint ignore:end*/
