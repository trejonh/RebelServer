"use strict";
/* globals Chartist*/
(function() {

  angular
    .module('clientApp')
    .service('GraphService', GraphService);

  //meanData.$inject = ['$http', 'authentication'];
  function GraphService() { //jshint ignore:line

    var initGaugeGraph = function(gaugeData) {
      return new Chartist.Pie(gaugeData.container, {
        labels: gaugeData.labels,
        series: gaugeData.series
      //  name: gaugeData.title
      }, {
        donut: true,
        donutWidth: 60,
        startAngle: 270,
        total: gaugeData.total,
        showLabel: true,
        labelDirection: 'explode',
        height: '400px'
      });
    };

    return {
      initGaugeGraph: initGaugeGraph
    };
  }

})();
