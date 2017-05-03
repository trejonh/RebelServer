"use strict";
/* globals Chartist*/
(function() {

    angular
        .module('clientApp')
        .service('GraphService', GraphService);

    //meanData.$inject = ['$http', 'authentication'];
    function GraphService() { //jshint ignore:line
        var initHourlyGraph = function(graph) {
            console.log(graph);
            var outlets = graph.outlets;
            var labels = [];
            var series = [];
            var legend = [];
            for (var outlet in outlets) {
                var tempLabels = [];
                var tempSeries = [];
                for (var data in outlet.hourlyWattage) {
                    tempLabels.push(data.hour);
                    tempSeries.push(data.wattage);
                }
                labels = tempLabels;
                series.push(tempSeries);
                legend.push(outlet.nickname)
            }
            console.log(labels);
            console.log(series);
            console.log(legend);
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
            for (var outlet in outlets) {
                var tempLabels = [];
                var tempSeries = [];
                for (var data in outlet.dailyWattage) {
                    var date = new Date(data.day);
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
                    tempSeries.push(data.wattage);
                }
                labels = tempLabels;
                series.push(tempSeries);
                legend.push(outlet.nickname)
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
