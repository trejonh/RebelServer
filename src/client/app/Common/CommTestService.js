"use strict";

(function() {

  angular
    .module("clientApp")
    .service("particleServ", particleServ);

  particleServ.$inject = ["$http"];

  function particleServ($http) {//jshint ignore:line
    var getDeviceStatus = function() {
      return $http.get("http://localhost:3000/particleTest");
    };
  return {
    getDeviceStatus: getDeviceStatus
  };
}
})();
