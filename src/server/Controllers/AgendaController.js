var mongoConnectionString = process.env["TestDB"] ? "mongodb://localhost/tests" : "mongodb://localhost/smartHomeDevices"; //jshint ignore:line
var Agenda = require('agenda');
var AGENDA = new Agenda({
    db: {
        address: mongoConnectionString
    }
});
var particleRequest = require("request");
AGENDA.start();
module.exports.defineJob = function(functionName, args) {
    return AGENDA.define(functionName, args, function(job, done) {
        var data = job.attrs.data;
        console.log(data);
        switchPower(data,done);
    });
};

module.exports.scheduleJob = function(functionName,timeHours,timeMin) {
    return AGENDA.every("day at "+timeHours+":"+timeMin,functionName);
};

module.exports.cancel = function(names){
  AGENDA.cancel(names,function(err, numRemoved){
    if(err){
      console.log(err);
    }
  });
};

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
