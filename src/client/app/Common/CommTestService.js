"use strict";

(function() {

  angular
    .module("clientApp")
    .service("particleServ", particleServ);

  particleServ.$inject = ["$http","$https"];

  function particleServ($http,$https) {//jshint ignore:line
    var getDeviceStatus = function() {
      return $http.get('http://'+window.location.hostname+':3000/particleTest');
    };

    var toggle = function(onOff,id,token){
      $https.post("https://api.particle.io/v1/devices/"+id+"/led?access_token="+token);
    };

  return {
    getDeviceStatus: getDeviceStatus,
    toggle: toggle
  };
}
})();
