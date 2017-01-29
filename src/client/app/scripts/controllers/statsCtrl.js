'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RegisteruserCtrl
 * @description
 * # RegisteruserCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('StatsCtrl', function($scope, $route, deviceService) { //GraphService, authentication) {
    var stats = this;
    var deviceId = $route.current.params.deviceID;
    $scope.selectedAnOutlet = true;
    stats.device = {};
    stats.outlet = {};
    stats.outlets = [];
    $scope.manualSwitchClass = "fa fa-toggle-on fa-5x";
    stats.taskScheduler = {
      manualOn: true,
      scheduleOn: "",
      repeatOn: true,
      scheduleOff: "",
      repeatOff: true,
      setOnTime: [],
      setOffTime: []
    };

    stats.costPerKWH = 0.5;

    deviceService.getDevices(null, deviceId).then(function(data) {
      stats.device = data.data[0];
      $scope.outlets = data.data[0].outlets;
    }, function error(err) {
      if (err) {
        console.log(err);
      }
    });
    //setSelectedOutet
    $scope.setSelectedOutlet = function(outlet){
      console.log(outlet);
      stats.outlet = outlet;
    };
    //isactive
    $scope.isActive = function() {
      var lastSeen = Date.parse(stats.device.lastSeenOnline);
      var now = Date.now();
      if (now - lastSeen <= 30000) {
        return {
          "color": "green",
          "margin-left": "55px"
        };
      } else {
        return {
          "color": "red",
          "margin-left": "55px"
        };
      }
    };
    //manual switch
    $scope.manualSwitchClick = function() {
      if (!stats.outlet) {
        $scope.selectedAnOutlet = false;
        return;
      }
      if (stats.outlet.isOn === 1) {
        $scope.manualSwitchClass = "fa fa-toggle-off fa-5x";
      } else {
        $scope.manualSwitchClass = "fa fa-toggle-on fa-5x";
      }
      stats.outlet.username = stats.device.owner;
      console.log(stats.outlet);
      deviceService.manualSwitch(stats.outlet);
      $scope.selectedAnOutlet = true;
    };
    //scheduleOn
    $scope.scheduleOn = function() {
      if (!stats.outlet) {
        $scope.selectedAnOutlet = false;
        return;
      }
      $scope.selectedAnOutlet = true;
    };
    //scheduleOff
    $scope.scheduleOff = function() {
      if (!stats.outlet) {
        $scope.selectedAnOutlet = false;
        return;
      }
      $scope.selectedAnOutlet = true;
    };
    //changeDeviceName
    $scope.changeDeviceName = function() {
      $("#changeDeviceNameModal").on("hidden.bs.modal", function(eve) { //jshint ignore:line
        deviceService.changeDeviceName(stats.device).then(function(data) {
          stats.device = data.data;
        }, function error(err) {
          console.log(err);
        });
      });
      $("#changeDeviceNameModal").modal("hide"); //jshint ignore:line
    };
    //changeOutletName
    $scope.changeOutletName = function() {
      $("#changeOutletNameModal").modal("hide"); //jshint ignore:line
      stats.outlet.owner = stats.device.owner;
      deviceService.changeOutletNickname(stats.outlet).then(function(data) {
        stats.device = data.data;
      }, function error(err) {
        console.log(err);
      });
    };
  });

/**
 * @ngdoc function
 * @name getEnergyConsumedPerDay
 *@description
 * # get Energy consumed per day
 * @param wattage - watts consumed
 * @param timeOn - total time on in one day in milliseconds
 */
function getEnergyConsumedPerDay(wattage, timeOn) { //jshint ignore:line
  timeOn = (((timeOn / 1000) / 60) / 60); //ms->secs->mins->hours
  return (wattage * timeOn) / 1000; //Energy in kilowatts-hours/day
}

/**
 * @ngdoc function
 * @name getEnergyConsumedPerDay
 *@description
 * # get Energy consumed per day
 * @param wattage - watts consumed
 * @param timeOn - total time on in one day in milliseconds
 * @param costPerKWH - cost of Energy per kilowatts-hour in cents (.01)
 */
function getCostOfEnergyConsumedPerDay(wattage, timeOn, costPerKWH) { // jshint ignore:line
  return getEnergyConsumedPerDay(wattage, timeOn) * costPerKWH; //Cost in $/day
}
