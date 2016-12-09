var mongoose = require('mongoose');
var User = mongoose.model('registeredUserModel');
var deviceCtrl = require("./SmartDeviceController");
module.exports.profileRead = function(req, res) {

    // If no user ID exists in the JWT return a 401
    if (!req.payload._id) {
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    } else {
        // Otherwise continue
        User
            .findById(req.payload._id)
            .exec(function(err, user) {
                if (err) {
                    console.log(err);
                    console.log("finding user went wrong");
                }
                res.status(200).json(user);
            });
    }
};

module.exports.profileDelete = function(req, res) {
    User.findByIdAndRemove(req.query._id, function() {
        res.status(200);
    });
};

module.exports.updateUser = function(req, res) {
    User.findById(req.body._id,function(err, user){
        if(err){
          res.status(500);
          res.json(err);
          return;
        }
        if(req.body.newPassword)
          user.setPassword(req.body.newPassword);
        if(req.body.newPic)
          user.profileImage =req.body.newPic;
        if(req.body.deviceID && user.devices !== null && user.devices.indexOf(req.body.deviceID) === -1){
          deviceCtrl.addDevice(req.body.deviceID, req.body.username);
          user.devices.push(req.body.deviceID);
        }
        user.save();
        res.status(200);
    });
};
