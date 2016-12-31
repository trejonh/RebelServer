var mongoose = require('mongoose');
var ctrlOutlet = require('./OutletController');
var Device = mongoose.model('smartDeviceModel');

module.exports.getDevices = function(req, res) {
    var searchQuery = req.query.username ? {
        owner: req.query.username
    } : {
        deviceID: req.query.deviceID
    };
    Device.find(searchQuery).lean().exec(function(err, devices) {
        if (err) {
            console.log(err);
            res.status(500);
            res.json(err);
            return;
        }
        res.status(200).json(devices);
    });
};
module.exports.addDevice = function(deviceID, username) {
    var newDevice = new Device();
    newDevice.lastSeenOnline = (new Date()).toTimeString();
    newDevice.deviceID = deviceID;
    newDevice.owner = username;
    newDevice.deviceName = "Smart Power Strip" + (new Date()).toLocaleDateString();
    ctrlOutlet.getOutlets(deviceID, function(err, outlets) {
        if (err) {
            console.log(err);
            return;
        }
        newDevice.outlets = outlets;
        newDevice.save(function(err, dev, num) {
            if (err)
                console.log(err);
        });
    });
};

module.exports.changeDeviceName = function(req, res) {
    var searchQuery = {
        $and: [{
            owner: req.body.username
        }, {
            deviceID: req.body.deviceID
        }]
    };
    Device.findOne(searchQuery, function(err, device) {
        if (err) {
            console.log(err);
            res.status(500);
            res.json(err);
            return;
        } else if (device) {
            device.deviceName = req.body.deviceName;
            device.save(function(err, raw) {
                res.status(200).json(device);
            });
        } else {
            res.status(500).json({
                error: "device is null"
            });
        }
    });
};
