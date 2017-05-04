"use strict";
/* globals Chartist*/
(function() {

    angular
        .module('clientApp')
        .service('GraphService', GraphService);

    //meanData.$inject = ['$http', 'authentication'];
    function GraphService() { //jshint ignore:line
        var initHourlyGraph = function(graph) {
            var ele = document.getElementById('hourlyLegend');
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
                    right: 40
                },
                lineSmooth: Chartist.Interpolation.cardinal({
                    fillHoles: true,
                }),
                low: 0,
                plugins: [
                    Chartist.plugins.legend(),
                    Chartist.plugins.ctAxisTitle({
                        axisX: {
                            axisTitle: 'Hour of day',
                            axisClass:'ct-axis-title',
                            offset: {
                                x: 0,
                                y: 50
                            },
                            textAnchor: 'middle'
                        },
                        axisY: {
                            axisTitle: 'Wattage (w)',
                            axisClass:'ct-axis-title',
                            offset: {
                                x: 0,
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
                            var tip = outletNickname+" is using "+energyUsedPerHour+" kilowatts per hour\n";
                            tip += "This totals to a cost of $"+cost+" per hour";
                            return tip;
                        }
                    })
                ]
            });
            return hourlyGraph;
        };

        var initDailyGraph = function(graph) {
            var ele = document.getElementById('dailyLegend');
            var outlets = graph.outlets;
            var labels = [];
            var series = [];
            for (var i = 0; i < outlets.length; i++) {
                var tempLabels = [];
                var tempSeries = [];
                for (var j = 0; j < outlets[i].dailyWattage.length; j++) {
                    var date = new Date(outlets[i].dailyWattage[j].day);
                    var dateStr = "";
                    switch (date.getDay() + 1) {
                        case 1:
                            dateStr += "Mon ";
                            break;
                        case 2:
                            dateStr += "Tue ";
                            break;
                        case 3:
                            dateStr += "Wed ";
                            break;
                        case 4:
                            dateStr += "Thur ";
                            break;
                        case 5:
                            dateStr += "Fri ";
                            break;
                        case 6:
                            dateStr += "Sat ";
                            break;
                        case 7:
                            dateStr += "Sun ";
                            break;
                    }
                    dateStr += (date.getMonth() + 1) + "/" + date.getDate();
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
                chartPadding: {
                    right: 40
                },
                lineSmooth: Chartist.Interpolation.cardinal({
                    fillHoles: true,
                }),
                low: 0,
                plugins: [
                    Chartist.plugins.legend(),
                    Chartist.plugins.ctAxisTitle({
                        axisX: {
                            axisTitle: 'Day',
                            axisClass:'ct-axis-title',
                            offset: {
                                x: 0,
                                y: 50
                            },
                            textAnchor: 'middle'
                        },
                        axisY: {
                            axisTitle: 'Wattage (w)',
                            axisClass:'ct-axis-title',
                            offset: {
                                x: 0,
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
                            var tip = outletNickname+" is using "+energyUsedPerHour+" kilowatts-hours per day\n";
                            tip += "This totals to a cost of $"+cost+" per day";
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