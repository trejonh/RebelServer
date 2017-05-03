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
            var legend = [];
            for (var i = 0; i < outlets.length; i++) {
                var tempLabels = [];
                var tempSeries = [];
                for (var j = 0; j < outlets[i].hourlyWattage.length; j++) {
                    tempLabels.push(outlets[i].hourlyWattage[j].hour);
                    tempSeries.push(outlets[i].hourlyWattage[j].wattage);
                }
                series.push(tempSeries);
                legend.push(outlets[i].nickname)
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
                    Chartist.plugins.legend({
                        legendNames: legend,
                    })
                ]
            });
            return hourlyGraph;
        };

        var initDailyGraph = function(graph) {
            var outlets = graph.outlets;
            var labels = [];
            var series = [];
            var legend = [];
            for (var i = 0; i < outlets.length;i++) {
                var tempLabels = [];
                var tempSeries = [];
                for (var j = 0; j < outlets[i].dailyWattage.length;j++) {
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
                    dateStr += (date.getMonth()+1)+"/"+date.getDate();
                    tempLabels.push(dateStr);
                    tempSeries.push(outlets[i].dailyWattage[j].wattage);
                }
                labels = tempLabels;
                series.push(tempSeries);
                legend.push(outlets[i].nickname)
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
                    Chartist.plugins.legend({
                        legendNames: legend,
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
