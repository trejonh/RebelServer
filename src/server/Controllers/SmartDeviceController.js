var mongoose = require('mongoose');
var ctrlOutlet = require('./OutletController');
var Device = mongoose.model('smartDeviceModel');

module.exports.getDevices = function(req, res) {
    console.log(req.query);
    var searchQuery = req.query.username ? {
        owner: req.query.username
    } : {
        deviceID: req.query.deviceID
    };
    Device.find(searchQuery, function(err, devices) {
        if (err || !devices) {
            console.log(err);
            res.status(500);
            res.json(err);
            return;
        }
        if (devices) {
            res.status(200).json(devices);
        }
    });
};
module.exports.addDevice = function(deviceID, username) {
    var newDevice = new Device();
    newDevice.lastSeenOnline = (new Date()).toTimeString();
    newDevice.deviceID = deviceID;
    newDevice.owner = username;
    newDevice.deviceName = "Smart Power Strip " + (new Date()).toLocaleDateString();
    ctrlOutlet.getOutlets(deviceID, function(err, outlets) {
        if (err) {
            console.log(err);
            return;
        }
        newDevice.outlets = outlets;
        newDevice.save(function(err, dev, num) {
            if (err) {
                console.log(err);
                res.status(500).json({
                    err: err
                });
            } else if (dev) {
                res.status(200).json(dev);
            }
        });
    });
};

module.exports.changeDeviceName = function(req, res) {
    //need to search on _id field, more stable reults
    var searchQuery = {
        _id: req.body._id
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
