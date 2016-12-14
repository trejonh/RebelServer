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
    stats.outlet = {};
    stats.costPerKWH = 0.5;
    var outlet = {};
    var usageGraph;
    var costGraph;
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
      stats.outlet = outletData;
      //power Consumption
      var usageSeries = [getEnergyConsumedPerDay(outlet.wattage, 86400000), getEnergyConsumedPerDay(652, 86400000/2), getEnergyConsumedPerDay(785, 86400000/5)];
      var usageTotal = 0;
      usageSeries.forEach(function(item) {
        usageTotal += item;
      });
      usageTotal = usageTotal * 2;
      var graphData = {
        title: "Power Consumption",
        container: "#currentUsage",
        labels: ["Desired Power Consumption", "Current Power Consumption", "Previous Power Consumption"],
        series: usageSeries,
        total: usageTotal
      };
      var costSeries = [getCostOfEnergyConsumedPerDay(outlet.wattage, 86400000, stats.costPerKWH),
        getCostOfEnergyConsumedPerDay(652, 86400000/2, stats.costPerKWH),
        getCostOfEnergyConsumedPerDay(785, 86400000/5, stats.costPerKWH)
      ];
      var costTotal = 0;
      costSeries.forEach(function(item) {
        costTotal += item;
      });
      costTotal = costTotal * 2;
      console.log(costTotal);
      //power cost

      var graphData2 = {
        title: "Power Cost",
        container: "#currentCost",
        labels: ["Desired Cost", "Current Cost", "Previous cost"],
        series: costSeries,
        total: costTotal
      };
      //$("#detailedStats").on("shown.bs.modal", function() { //jshint ignore:line
      if (usageGraph || costGraph) {
        usageGraph.update(graphData);
        costGraph.update(graphData2);

      } else {
        usageGraph = GraphService.initGaugeGraph(graphData);
        costGraph = GraphService.initGaugeGraph(graphData2);
      }
      //});
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
