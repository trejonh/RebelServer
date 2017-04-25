var mongoose = require("mongoose");
var mongoConnectionString = process.env["TestDB"] ? "mongodb://localhost/tests" : "mongodb://localhost/smartHomeDevices"; //jshint ignore:line
var Agenda = require('agenda');
var particleRequest = require("request");
var Devices = mongoose.model("smartDeviceModel");
var Users = mongoose.model("registeredUserModel");
var AGENDA = new Agenda({
    db: {
        address: mongoConnectionString
    }
});
var particleRequest = require("request");

AGENDA.on('ready', function() {
    console.log('ready!');
    AGENDA.start();
});
module.exports.defineJob = function(functionName) {
    return AGENDA.define(functionName, function(job, done) {
        var data = job.attrs.data;
        job.touch(function() {
            switchPower(data, done);
        });
    });
};

module.exports.scheduleJob = function(functionName, timeHours, timeMin, data) {
    return AGENDA.every(timeMin + " " + timeHours + " * * *", functionName, data);
};

module.exports.cancel = function(names) {
    console.log(names);
    AGENDA.cancel({
        name: names
    }, function(err, numRemoved) {
        if (err) {
            console.log(err);
        }
    });
};
module.exports.agenda = AGENDA;

function switchPower(outlet, done) {
    var particleUrl = "https://api.particle.io/v1/devices/";
    particleRequest.post(particleUrl + outlet.deviceID + "/" + outlet.method + "?access_token=" + outlet.access_token, {
        form: {
            args: outlet.outletNumber
        }
    }, function(err, response, body) {
        console.log(body);
        console.log(err);
        console.log(response)
        if (err) {
            console.log(err);
            notifyUser(outlet.deviceObjID, outlet.method, "a failure due to: " + err.error_description, done);
        } else {
            notifyUser(outlet.deviceObjID, outlet.method, " successful.", done);
        }
    });
}

function notifyUser(deviceID, method, passedOrFail, done) {
    Devices.findById(deviceID, function(err, device) {
        if (err) {
            console.log(err);
            return;
        } else if (device) {
            var notification = {
                timeExecuted: (new Date()).toLocaleString(),
                device: device.deviceName,
                message: "",
                passedOrFail: passedOrFail
            };
            notification.message = "On " + notification.timeExecuted + ", " + notification.device + " tried to " + method + " and was" + passedOrFail;
            Users.findOne({
                username: device.owner
            }, function(err, user) {
                if (err) {
                    console.log(err);
                    return;
                } else if (user) {
                    var userNotifications = user.notifications; //.push(notification);
                    if (!userNotifications)
                        userNotifications = [];
                    userNotifications.push(notification);
                    Users.findByIdAndUpdate(user._id, {
                        $set: {
                            notifications: userNotifications
                        }
                    }, function(err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            });
        }
    });
}
