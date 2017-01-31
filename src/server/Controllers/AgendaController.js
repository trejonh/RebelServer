var mongoConnectionString = process.env["TestDB"] ? "mongodb://localhost/tests" : "mongodb://localhost/smartHomeDevices"; //jshint ignore:line
var Agenda = require('agenda');
var AGENDA = new Agenda({
    db: {
        address: mongoConnectionString
    }
});
var particleRequest = require("request");

AGENDA.on('ready', function() {

  AGENDA.start();
});
module.exports.defineJob = function(functionName) {
  console.log('in define job');
    return AGENDA.define(functionName, function(job, done) {
      console.log("in define");
        var data = job.attrs.data;
        console.log(data);
        switchPower(data,done);
    });
};

module.exports.scheduleJob = function(functionName,timeHours,timeMin,data) {
  console.log('scheduline');
    return AGENDA.every("day at "+timeHours+":"+timeMin,functionName,data);
};

module.exports.cancel = function(names){
  console.log('cancelled');
  AGENDA.cancel({name:names},function(err, numRemoved){
    if(err){
      console.log(err);
    }
  });
};
module.exports.agenda = AGENDA;
function switchPower(outlet, done) {
    var method = "turnOn";
    if (outlet.isOn)
        method = "turnOff";
    var particleUrl = "https://api.particle.io/v1/devices/";
    particleRequest.post(particleUrl + outlet.deviceID + "/" + method + "?access_token=" + outlet.accessToken, {
        form: {
            args: outlet.outletNumber
        }
    }, function(err, response, body) {
        if (err) {
            console.log(err);
        }
        done();
    });
}
