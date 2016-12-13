'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RegisteruserCtrl
 * @description
 * # RegisteruserCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('StatsCtrl', function($scope, $route, deviceService, gaugeGraphService) {
    var stats = this;
    var deviceId = $route.current.params.deviceID;
    stats.device = {};
    $scope.outlets = [];
    stats.costPerKWH = 0.5;
    var outlet = {};
    deviceService.getDevices(null, deviceId).success(function(data) {
      stats.device = data[0];
      $scope.outlets = data[0].outlets;
    }).error(function(err) {
      if (err) {
        console.log(err);
      }
    });
    $scope.getEnergyConsumedPerDay = function() {
      return getEnergyConsumedPerDay(outlet.wattage, outlet.elapsedTimeOn);
    };
    $scope.getCostOfEnergyConsumedPerDay = function() {
      return getCostOfEnergyConsumedPerDay(outlet.wattage, outlet.elapsedTimeOn, stats.costPerKWH);
    };
    $scope.saveClickedOutletData = function(outletData) {
      outlet = outletData;
      //power Consumption
      var graphData = {
        title : "Power Consumption",
        container: "currentUsage",
        outterMost : "Current Power Consumption",
        outterMostY: getEnergyConsumedPerDay(outlet.wattage, 100000000),
        middle : "Previous Power Consumption",
        middleY : getEnergyConsumedPerDay(652, 80),
        innerMost : "Desired Power Consumption",
        innerMostY : getEnergyConsumedPerDay(785, 8695412)
      };
      gaugeGraphService.initGraph(graphData);
      //power cost
      graphData = {
        title : "Cost of Energy per Day",
        container: "currentCost",
        outterMost : "Current Power Cost",
        outterMostY: getCostOfEnergyConsumedPerDay(outlet.wattage, 100000000, stats.costPerKWH),
        middle : "Previous Power Cost",
        middleY : getCostOfEnergyConsumedPerDay(outlet.wattage, 500000000, stats.costPerKWH),
        innerMost : "Desired Cost ",
        innerMostY : getCostOfEnergyConsumedPerDay(outlet.wattage, 100000000/5, stats.costPerKWH)
      };
      gaugeGraphService.initGraph(graphData);
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
  return (wattage * timeOn) / (1000 * 24); //Energy in kilowatts-hours/day
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
  return getEnergyConsumedPerDay(wattage, timeOn) * (costPerKWH / 100); //Cost in $/day
}
