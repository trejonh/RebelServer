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
                series.push({ name: outlets[i].nickname, data: tempSeries });
                //legend.push(outlets[i].nickname)
            }
            var hourlyGraph = new Chartist.Line(graph.container, {
                labels: labels,
                series: series,
            }, {
                fullWidth: true,
                chartPadding: {
                    right: 10
                },
                lineSmooth: Chartist.Interpolation.cardinal({
                    fillHoles: true,
                }),
                low: 0,
                plugins: [
                    Chartist.plugins.legend({className:"hourly",position:'top'}),
                    Chartist.plugins.ctAxisTitle({
                        axisX: {
                            axisTitle: 'Hour of day',
                            axisClass:'ct-axis-title-y',
                            offset: {
                                x: 0,
                                y: 20
                            },
                            textAnchor: 'middle'
                        },
                        axisY: {
                            axisTitle: 'Wattage (w)',
                            axisClass:'ct-axis-title-y',
                            offset: {
                                x: 20,
                                y: 0
                            },
                            textAnchor: 'middle',
                            flipTitle: true
                        }
                    }),
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
                    console.log(outlets[i]);
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
                chartPadding: {
                    right: 50
                },
                lineSmooth: Chartist.Interpolation.cardinal({
                    fillHoles: true,
                }),
                low: 0,
                plugins: [
                    Chartist.plugins.legend({className:"daily",position:'top'}),
                    Chartist.plugins.ctAxisTitle({
                        axisX: {
                            axisTitle: 'Month/Day',
                            axisClass:'ct-axis-title-x',
                            offset: {
                                x: 0,
                                y: 20
                            },
                            textAnchor: 'middle'
                        },
                        axisY: {
                            axisTitle: 'Wattage (w)',
                            axisClass:'ct-axis-title-y',
                            offset: {
                                x: 20,
                                y: 0
                            },
                            textAnchor: 'middle',
                            flipTitle: true
                        }
                    }),
                    Chartist.plugins.tooltip({
                        tooltipFnc: function(outletNickname, wattage){
                            var energyUsedPerHour = getEnergyConsumedPerDay(wattage,3600000*4);
                            var cost =  getCostOfEnergyConsumedPerDay(wattage,3600000*4,graph.cost);
                            var tip = "<p>"+outletNickname+" is using "+parseFloat(Math.round(energyUsedPerHour*100)/100).toFixed(2)+" kilowatts-hours per day<br>";
                            tip += "This totals to a cost of $"+parseFloat(Math.round(cost*100)/100).toFixed(2)+" per day</p>";
                            return tip;
                        }
                    })
                ]
            });
            return dailyGraph;
        };

        return {
            initHourlyGraph: initHourlyGraph,
            initDailyGraph: initDailyGraph
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