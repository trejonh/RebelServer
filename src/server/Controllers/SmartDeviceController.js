var mongoose = require('mongoose');
var ctrlOutlet = require('./OutletController');
var Device = mongoose.model('smartDeviceModel');
var Outlet = mongoose.model('outletDataModel');

module.exports.getDevices = function(req, res) {
    Device.find({
        owner: req.body._id
    }).lean().exec(function(err, devices) {
        if (err) {
            console.log(err);
            res.status(500);
            res.json(err);
            return;
        }
        res.status(200).json(devices);
    });
};
module.exports.addDevice = function(deviceID, _id) {
    var newDevice = new Device();
    newDevice.deviceName = "Some Name";
    newDevice.deviceID = deviceID;
    newDevice.owner = _id;
    newDevice.outlets = ctrlOutlet.getDevices(req.body._id);
    newDevice.save();
};
