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
            .findById(req.payload._id, '-hash -salt')
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
        res.status(200).end();
        return;
    });
};

module.exports.removeNote = function(req, res) {
    User.findById(req.query._id, function(err, user) {
        if (err || !user) {
            console.log(err);
            res.status(500).json({
                err: err
            });
            return;
        } else if (user) {
            var notifications = user.notifications;
            var newArray = [];
            for (var i = 0; i <notifications.length; i++) { //jshint ignore:line
                if (notifications[i].message !== req.query.message) {
                    newArray.push(notification);
                }
            }
            User.findByIdAndUpdate(req.query._id, {
                $set: {
                    notifications: newArray
                }
            }, function(err, doc) {
                res.status(200).end();
            });
        }
    });
};

module.exports.updateUser = function(req, res) {
    User.findById(req.body._id, '-hash -salt', function(err, user) {
        if (err) {
            res.status(500);
            res.json(err);
            return;
        } else if (user) {
            if (req.body.newPassword)
                user.setPassword(req.body.newPassword);
            if (req.body.newPic)
                user.profileImage = req.body.newPic;
            if (req.body.phoneNumber)
                user.phoneNumber = req.body.phoneNumber;
            if (req.body.deviceID && user.devices.indexOf(req.body.deviceID) === -1) {
                deviceCtrl.addDevice(req.body.deviceID, req.body.username);
                user.devices.push(req.body.deviceID);
            }
            user.save(function(err) {
                if (!process.env["TestDB"]) //jshint ignore:line
                    console.log(err);
                res.status(200).json(user);
            });
        } else {
            res.status(500).json({
                err: "user not found"
            });
        }
    });
};
