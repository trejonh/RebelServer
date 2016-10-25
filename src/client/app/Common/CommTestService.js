"use strict";

(function() {

  angular
    .module("clientApp")
    .service("particleServ", particleServ);

  particleServ.$inject = ["$http"];

  function particleServ($http) {//jshint ignore:line
    var getDeviceStatus = function() {
      return $http.get('http://'+window.location.hostname+':3000/particleTest');
    };

    var toggle = function(id,token,state){
      return $http.post("https://api.particle.io/v1/devices/"+id+"/led?access_token="+token,state);
    };

  return {
    getDeviceStatus: getDeviceStatus,
    toggle:toggle
  };
}
})();
