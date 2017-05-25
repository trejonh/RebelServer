"use strict";
/* globals Chartist*/
(function() {

    angular
        .module('clientApp')
        .service('GraphService', GraphService);

    //meanData.$inject = ['$http', 'authentication'];
    function GraphService() { //jshint ignore:line
        var initHourlyGraph = function(graph) {
            var outlets = graph.outlets;
            var labels = [];
            var series = [];
            //var legend = [];
            for (var i = 0; i < outlets.length; i++) {
                var tempLabels = [];
                var tempSeries = [];
                for (var j = 0; j < outlets[i].hourlyWattage.length; j++) {
                    tempLabels.push('' + outlets[i].hourlyWattage[j].hour+':00');
                    tempSeries.push(outlets[i].hourlyWattage[j].wattage);
                }
                labels = tempLabels;
                series.push({ name: outlets[i].nickname, data: tempSeries });
                //legend.push(outlets[i].nickname)
            }
            var hourlyGraph = new Chartist.Line(graph.container, {
                labels: labels,
                series: series,
            }, {
                fullWidth: true,
                axisY:{onlyInteger:false},
                chartPadding: {
                    top: 20,
                    right: 0,
                    bottom: 20,
                    left: 0
                },
                lineSmooth: Chartist.Interpolation.cardinal({
                    fillHoles: true,
                }),
                low: 0,
                plugins: [
                    Chartist.plugins.legend({position:'bottom'}),
                    Chartist.plugins.tooltip({
                        tooltipFnc: function(outletNickname, wattage){
                            var energyUsedPerHour = getEnergyConsumedPerDay(wattage,3600000);
                            var cost =  getCostOfEnergyConsumedPerDay(wattage,3600000,graph.cost);
                            var tip = "<p>"+outletNickname+" is using "+parseFloat(Math.round(energyUsedPerHour*100)/100).toFixed(2)+" kilowatts per hour<br>";
                            tip += "This totals to a cost of $"+parseFloat(Math.round(cost*100)/100).toFixed(2)+" per hour</p>";
                            return tip;
                        }
                    })
                ]
            });
            return hourlyGraph;
        };

        var initDailyGraph = function(graph) {
            var outlets = graph.outlets;
            var labels = [];
            var series = [];
            for (var i = 0; i < outlets.length; i++) {
                var tempLabels = [];
                var tempSeries = [];
                for (var j = 0; j < outlets[i].dailyWattage.length; j++) {
                    var date = new Date(outlets[i].dailyWattage[j].day);
                    var dateStr = (date.getMonth() + 1) + "/" + date.getDate();
                    tempLabels.push(dateStr);
                    tempSeries.push(outlets[i].dailyWattage[j].wattage);
                }
                labels = tempLabels;
                series.push({ name: outlets[i].nickname, data: tempSeries });
            }
            var dailyGraph = new Chartist.Line(graph.container, {
                labels: labels,
                series: series,
            }, {
                fullWidth: true,
                axisY:{onlyInteger:false},
                chartPadding: {
                    top: 20,
                    right: 0,
                    bottom: 20,
                    left: 0
                },
                lineSmooth: Chartist.Interpolation.cardinal({
                    fillHoles: true,
                }),
                low: 0,
                plugins: [
                    //Chartist.plugins.legend({position:'bottom'}),
                    Chartist.plugins.tooltip({
                        tooltipFnc: function(outletNickname, wattage){
                            var energyUsedPerHour = getEnergyConsumedPerDay(wattage,3600000*24);
                            var cost =  getCostOfEnergyConsumedPerDay(wattage,3600000*24,graph.cost);
                            var tip = "<p>"+outletNickname+" is using "+parseFloat(Math.round(energyUsedPerHour*100)/100).toFixed(2)+" kilowatts-hours per day<br>";
                            tip += "This totals to a cost of $"+parseFloat(Math.round(cost*100)/100).toFixed(2)+" per day</p>";
                            return tip;
                        }
                    })
                ]
            });
            return dailyGraph;
        };

        var updateGraphs = function(hourly,daily){
            var h =initHourlyGraph();
            var d =initDailyGraph();
            return {hourly:h, daily: d};
        };

        return {
            initHourlyGraph: initHourlyGraph,
            initDailyGraph: initDailyGraph,
            updateGraphs: updateGraphs
        };
    }

})();

/**
 * @ngdoc function
 * @name getEnergyConsumedPerDay
 *@description
 * # get Energy consumed per day
 * @param wattage - watts consumed
 * @param timeOn - total time on in one day in milliseconds
 */
function getEnergyConsumedPerDay(wattage, timeOn) { //jshint ignore:line
    var time = (((timeOn / 1000) / 60) / 60); //ms->secs->mins->hours
    return (wattage/1000)* time; //Energy in kilowatts-hours/day
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
