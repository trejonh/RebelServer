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
    $scope.clickedOutlet = true;
    stats.device = {};
    $scope.outlets = [];
    stats.outlet = {};
    stats.taskScheduler = {
      manualOn: true,
      scheduleOn: "",
      repeatOn: true,
      scheduleOff: "",
      repeatOff: true,
      setOnTime: [],
      setOffTime: []
    };
    stats.isActive = function() {
      var lastSeen = Date.Parse(stats.device.lastSeenOnline);
      var now = Date.now();
      if (now - lastSeen <= 30000) {
        return "green";
      } else {
        return "red";
      }
    };
    stats.costPerKWH = 0.5;
    var usageTotal = 0;
    var costTotal = 0;
    //var outlet = {};
    var usageGraph;
    var costGraph;
    deviceService.getDevices(null, deviceId).success(function(data) {
      stats.device = data[0];
      $scope.outlets = data[0].outlets;
      //  $("tr#outletStatRow")[0].click();//jshint ignore:line
    }).error(function(err) {
      if (err) {
        console.log(err);
      }
    });
    $scope.saveClickedOutletData = function(outletData) {
      $scope.clickedOutlet = false;
      stats.outlet = outletData;
      //power Consumption
      var usageSeries = [getEnergyConsumedPerDay(parseInt(stats.outlet.wattage), 86400000),
        getEnergyConsumedPerDay(652, 86400000 / 2),
        getEnergyConsumedPerDay(785, 86400000 / 5)
      ];
      var costSeries = [getCostOfEnergyConsumedPerDay(parseInt(stats.outlet.wattage), 86400000, stats.costPerKWH),
        getCostOfEnergyConsumedPerDay(652, 86400000 / 2, stats.costPerKWH),
        getCostOfEnergyConsumedPerDay(785, 86400000 / 5, stats.costPerKWH)
      ];
      //power cost
      for (var i = 0; i < costSeries.length && i < usageSeries.length; i++) {
        costTotal += costSeries[i];
        usageTotal += usageSeries[i];
      }
      costTotal = costTotal * 2;
      usageTotal = usageTotal * 2;

      var graphData = {
        title: "Power Consumption",
        container: "#currentUsage",
        labels: ["Desired Power Consumption", "Current Power Consumption", "Previous Power Consumption"],
        series: usageSeries,
        total: usageTotal
      };

      var graphData2 = {
        title: "Power Cost",
        container: "#currentCost",
        labels: ["Desired Cost", "Current Cost", "Previous cost"],
        series: costSeries,
        total: costTotal
      };
      if (usageGraph || costGraph) {
        usageGraph.update(graphData);
        costGraph.update(graphData2);

      } else {
        usageGraph = GraphService.initGaugeGraph(graphData);
        costGraph = GraphService.initGaugeGraph(graphData2);
        usageGraph.update();
        costGraph.update();
      }
    };

    $scope.scheduleTasks = function() {
      var offTime = [(new Date(stats.taskScheduler.scheduleOff)).getHours(), (new Date(stats.taskScheduler.scheduleOff)).getMinutes()];
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
      if ((stats.taskScheduler.scheduleOff || stats.taskScheduler.scheduleOff === undefined) && $("#scheduleOff")[0].type === "text") { //jshint ignore:line
        var timeSetOff = $("#scheduleOff").val(); //jshint ignore:line
        timeSetOff = timeSetOff.trim().split(":");
        console.log(timeSetOff);
        if ((timeSetOff[0] < 0 || timeSetOff[0] > 24) || (timeSetOff[1] < 0 || timeSetOff[1] > 59)) {
          alert("Please enter a proper date"); //jshint ignore:line
          return;
        } else {
          offTime = timeSetOff;
        }
      }
      stats.taskScheduler.setOnTime = onTime;
      stats.taskScheduler.setOffTime = offTime;
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
