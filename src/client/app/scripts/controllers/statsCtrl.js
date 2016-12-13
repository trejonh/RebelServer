'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RegisteruserCtrl
 * @description
 * # RegisteruserCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('StatsCtrl', function($scope, $route, deviceService, GraphService) {
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
        title: "Power Consumption",
        container: "#currentUsage",
        labels: ["Desired Power Consumption","Current Power Consumption","Previous Power Consumption"],
        series: [getEnergyConsumedPerDay(outlet.wattage, 100000000),getEnergyConsumedPerDay(652, 80),getEnergyConsumedPerDay(785, 8695412)],
      };
      GraphService.initGaugeGraph(graphData);
      //power cost

      var graphData2 = {
        title: "Power Cost",
        container: "#currentCost",
        labels: ["Desired Cost","Current Cost","Previous cost"],
        series: [getCostOfEnergyConsumedPerDay(outlet.wattage, 100000000,stats.costPerKWH),getCostOfEnergyConsumedPerDay(652, 80,stats.costPerKWH),getCostOfEnergyConsumedPerDay(785, 8695412,stats.costPerKWH)],
      };
      console.log(GraphService.initGaugeGraph(graphData2));
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
