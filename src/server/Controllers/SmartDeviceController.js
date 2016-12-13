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
    newDevice.deviceName = "Some Name";
    newDevice.deviceID = deviceID;
    newDevice.owner = username;
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
