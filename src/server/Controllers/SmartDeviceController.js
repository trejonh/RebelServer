var mongoose = require('mongoose');
var ctrlOutlet = require('./OutletController');
var Device = mongoose.model('smartDeviceModel');

module.exports.getDevices = function(req, res) {
    Device.find({
        owner: req.query._id
    }).lean().exec(function(err, devices) {
        if (err) {
            console.log(err);
            res.status(500);
            res.json(err);
            return;
        }
        console.log(devices);
        res.status(200).json(devices);
    });
};
module.exports.addDevice = function(deviceID, _id) {
  console.log("adding device");
    var newDevice = new Device();
    newDevice.deviceName = "Some Name";
    console.log(deviceID+"   "+_id);
    newDevice.deviceID = deviceID;
    newDevice.owner = _id;
    newDevice.outlets = ctrlOutlet.getDevices(deviceID);
    newDevice.save(function(err,dev,num){
      if(err)
        console.log(err);
    });
};
