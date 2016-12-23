"use strict";
/* jshint ignore:start */
(function() {

  angular
    .module('clientApp')
    .service('deviceService', deviceService);

  deviceService.$inject = ['$http', '$window'];

  function deviceService($http) {

    var addDevice = function(device) {
      return $http.put('http://' + window.location.hostname + ':3000/profile', device).success(function(data) {
        console.log(data);
      }).error(function(err) {
        if (err)
          console.log(err);
      });
    };

    var getDevices = function(username,deviceID) {
      return $http.get('http://' + window.location.hostname + ':3000/devices', {
        params: {
          username: username,
          deviceID: deviceID
        }
      });
    };

    var changeDeviceName = function(device) {
      return $http.post('http://' + window.location.hostname + ':3000/changeDeviceName', device);
    };

    var changeOutletNickname = function(outlet) {
      return $http.post('http://' + window.location.hostname + ':3000/changeOutletNickname', outlet);
    };

    return {
      addDevice: addDevice,
      getDevices: getDevices,
      changeDeviceName: changeDeviceName,
      changeOutletNickname: changeOutletNickname
    };
  }

})();
/*jshint ignore:end*/
