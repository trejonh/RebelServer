var mongoConnectionString = process.env["TestDB"] ? "mongodb://localhost/tests" : "mongodb://localhost/smartHomeDevices"; //jshint ignore:line
var Agenda = require('agenda');
var particleRequest = require("request");
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
        var data = job.attrs.data;
        switchPower(data,done);
    });
};

module.exports.scheduleJob = function(functionName,timeHours,timeMin,data) {
    return AGENDA.every("* "+timeMin+" "+timeHours+" * *",functionName,data);
};

module.exports.cancel = function(names){
  AGENDA.cancel({name:names},function(err, numRemoved){
    if(err){
      console.log(err);
    }
  });
};
module.exports.agenda = AGENDA;
function switchPower(outlet, done) {
  console.log(outlet);
    var particleUrl = "https://api.particle.io/v1/devices/";
    particleRequest.post(particleUrl + outlet.deviceID + "/" + outlet.method + "?access_token=" + outlet.accessToken, {
        form: {
            args: outlet.outletNumber
        }
    }, function(err, response, body) {
        console.log(body);
        console.log(err);
        if (err) {
            console.log(err);
        }
        done();
    });
}
