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
    var newDevice = new Device();
    newDevice.deviceName = "Some Name";
    newDevice.deviceID = deviceID;
    newDevice.owner = _id;
    ctrlOutlet.getOutlets(deviceID,function(err,outlets){
      if(err){
        console.log(err);
        return;
      }
      newDevice.outlets =outlets;
      newDevice.save(function(err,dev,num){
        if(err)
          console.log(err);
    });
  });
};
