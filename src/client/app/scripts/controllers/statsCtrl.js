'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RegisteruserCtrl
 * @description
 * # RegisteruserCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('StatsCtrl', function($scope, $route, deviceService,GraphService, authentication) {
    var stats = this;
    var deviceId = $route.current.params.deviceID;
    $scope.selectedAnOutlet = true;
    stats.device = {};
    stats.outlet = undefined;
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
    $scope.setSelectedOutlet = function(outlet) {
      stats.outlet = outlet;
      $scope.outlet = outlet;
      if (stats.outlet.isOn === 0) {
        $scope.manualSwitchClass = "fa fa-toggle-off fa-5x";
      } else {
        $scope.manualSwitchClass = "fa fa-toggle-on fa-5x";
      }
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
      if (!stats.outlet || !$scope.oulet) {
        $scope.selectedAnOutlet = false;
        return;
      }
      if ($scope.outlet) {
        stats.outlet = $scope.outlet;
      }
      if (stats.outlet.isOn === 1) {
        $scope.manualSwitchClass = "fa fa-toggle-off fa-5x";
        stats.outlet.isOn = 0;
      } else {
        $scope.manualSwitchClass = "fa fa-toggle-on fa-5x";
        stats.outlet.isOn = 1;
      }
      stats.outlet.username = stats.device.owner;
      deviceService.manualSwitch(stats.outlet).then(function(data) {
        stats.device = data.data;
      }, function err(err) {
        if (err) {
          console.log(err);
        }
      });
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
      var onTask = {};
      var onTime = [(new Date(stats.taskScheduler.scheduleOn)).getHours(), (new Date(stats.taskScheduler.scheduleOn)).getMinutes()];
      if ((stats.taskScheduler.scheduleOn || stats.taskScheduler.scheduleOn === undefined) && $("#scheduleOn")[0].type === "text") { //jshint ignore:line
        var timeSetOn = $("#scheduleOn").val(); //jshint ignore:line
        timeSetOn = timeSetOn.trim().split(":");
        if ((timeSetOn[0] < 0 || timeSetOn[0] > 24) || (timeSetOn[1] < 0 || timeSetOn[1] > 59)) {
          alert("Please enter a proper date"); //jshint ignore:line
          return;
        } else {
          onTime = timeSetOn;
        }
      }
      if(onTime.indexOf(null) !== -1 ){
        return;
      }

      onTask.time = onTime;
      onTask.deviceID = stats.device.deviceID;
      onTask.deviceObjID = stats.device._id;
      onTask.userID = authentication.currentUser()._id;
      onTask.outletID = stats.outlet._id;
      onTask.outletNumber = stats.outlet.outletNumber;
      onTask.acces_token = stats.outlet.accessToken;
      onTask.method = "turnOn";
      deviceService.scheduleTask(onTask).then(function(data){
        stats.device = data.data;
      },function error(err){
        if(err){
          console.log(err);
        }
      });
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
