"use strict";
/* jshint ignore:start */
(function() {

  angular
    .module('clientApp')
    .service('deviceService', deviceService);

  deviceService.$inject = ['$http', '$window'];

  function deviceService($http) {

    var addDevice = function(device) {
      return $http.put('http://' + window.location.hostname + ':3000/profile', device);
    };

    var getDevices = function(username, deviceID) {
      return $http.get('http://' + window.location.hostname + ':3000/devices', {
        params: {
          username: username,
          deviceID: deviceID
        }
      });
    };
    var getOutlets = function(deviceID) {
      return $http.get('http://' + window.location.hostname + ':3000/outlets', {
        params: {
          deviceID: deviceID
        }
      });
    };

    var changeDeviceName = function(device) {
      return $http.post('http://' + window.location.hostname + ':3000/changeDeviceName', device);
    };

    var changeOutletNickname = function(outlet) {
      return $http.post('http://' + window.location.hostname + ':3000/updateOutletNickname', outlet);
    };

    var scheduleTask = function(task) {
      return $http.post('http://' + window.location.hostname + ':3000/scheduleTask', task);
    };

    var manualSwitch = function(outlet) {
      return $http.post('http://' + window.location.hostname + ':3000/manualSwitch', outlet);
    };

    var getNotifications = function(id) {
      return $http.get('http://' + window.location.hostname + ':3000/notifications', {
        params: {
          _id: id
        }
      });
    };

    return {
      addDevice: addDevice,
      getDevices: getDevices,
      getOutlets: getOutlets,
      changeDeviceName: changeDeviceName,
      changeOutletNickname: changeOutletNickname,
      scheduleTask: scheduleTask,
      manualSwitch: manualSwitch,
      getNotifications: getNotifications
    };
  }

})();
/*jshint ignore:end*/
