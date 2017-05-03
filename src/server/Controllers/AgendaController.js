var mongoose = require("mongoose");
var mongoConnectionString = process.env["TestDB"] ? "mongodb://localhost/tests" : "mongodb://localhost/smartHomeDevices"; //jshint ignore:line
var Agenda = require('agenda');
var particleRequest = require("request");
var Devices = mongoose.model("smartDeviceModel");
var Users = mongoose.model("registeredUserModel");
var Outlets = mongoose.model("outletDataModel");
const SECONDS_IN_DAY = 86400;
var serverTimeZone = new Date().getTimezoneOffset() / 60;
var AGENDA = new Agenda({
    db: {
        address: mongoConnectionString
    }
});
var particleRequest = require("request");
var hourlyCount = 0;
var dailyCount = 0;

AGENDA.define('hourlyWattage', function(job, done) {
	Outlets.find({outletNumber:{$ne:-1}}, function(err, allOutlets){
		if(err){
			console.error("error in calculating hourlyWattage");
			console.error(err);
			done();
			return;
		}
		if(allOutlets){
			console.log("outlets were found for updating hourly wattages");
			allOutlets.forEach(function(outlet){
				console.log(outlet);
				var currWattage = outlet.currentWattage;
				outlet.currentWattage = 0;
				if(outlet.hourlyWattage === undefined || outlet.hourlyWattage ===  null)
					outlet.hourlyWattage = [];
				outlet.hourlyWattage.push({ wattage: currWattage / SECONDS_IN_DAY, hour: (new Date()).getHours() });
				console.log("saving to device");
				outlet.save(function(err,raw){
					if(err){
						console.error("error saving");
						console.error(err);
						hourlyCount++;
					}else{
						updateOutletsInDevice(outlet,"h");						
					}
				});
			});
			while(hourlyCount < allOutlets.length){
				//wait
			}
			//reset count
			hourlyCount = 0;
			//now we can say done()
			done();
		}else{
			console.error("no outlets weren't found");
		}
	});
});


AGENDA.define('dailyWattage', function(job, done) {
    Outlets.find({outletNumber:{$ne:-1}},function(err,allOutlets){
		if(err){
			console.error("error in calculating dailyWattage");
			console.error(err);
			done();
			return;
		}
		if(allOutlets){
			console.log("outlets were found for updating");
			allOutlets.forEach(function(outlet){
				var dailyWattage = 0;
				for (var wattage in outlet.hourlyWattage)
					dailyWattage += wattage;
				outlet.hourlyWattage = [];
				if(outlet.dailyWattage === undefined || outlet.dailyWattage === null)
					outlet.dailyWattage = [];
				outlet.dailyWattage.push({ wattage: dailyWattage / 24, day: new Date() });
				console.log("saving to device");
				outlet.save(function(err,raw){
					if(err){
						console.error("error saving");
						console.error(err);
						dailyCount++;
					}else{
						updateOutletsInDevice(outlet,"d");						
					}
				});
			});
			while(dailyCount < allOutlets.length){
				//wait
			}
			//reset count
			dailyCount = 0;
			//now we can say done()
			done();
		}else{
			console.error("no outlets weren't found");
		}
	});
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

AGENDA.on('ready', function() {
    console.log('ready!');
    AGENDA.every("60 minutes", "hourlyWattage");
    AGENDA.every("24 hours", "dailyWattage");
	AGENDA.now("hourlyWattage");
    AGENDA.start();
});

module.exports.agenda = AGENDA;

function switchPower(outlet, done) {
    var particleUrl = "https://api.particle.io/v1/devices/";
    particleRequest.post(particleUrl + outlet.deviceID + "/" + outlet.method + "?access_token=" + outlet.access_token, {
        form: {
            args: outlet.outletNumber
        }
    }, function(err, response, body) {
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
						done();
                    });
                }
            });
        }
    });
}

function updateOutletsInDevice(outlet,count) {
    var currDevice;
    Devices.findOne({
        deviceID: outlet.deviceID
    }, function(err, device) {
        if (device) {
            var deviceOutlets = device.outlets;
            for (var i = 0; i < deviceOutlets.length; i++) {
                if (deviceOutlets[i].outletNumber === outlet.outletNumber) {
                    deviceOutlets[i] = outlet;
                    break;
                }
            }
            Devices.findByIdAndUpdate(device._id, { $set: { outlets: deviceOutlets } },
                function(err, dev) {
                    if (err || !dev) {
                        console.log("error in updating outlets");
                        console.log(err);
                    }
					if(count==="h")
						hourlyCount++;
					else
						dailyCount++;
                });
        }
    });
}
