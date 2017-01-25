//setup
var mongoose = require('mongoose');
var User = mongoose.model('registeredUserModel');
var Device = mongoose.model('smartDeviceModel');
var Outlets = mongoose.model("outletDataModel");

module.exports.delete = function(req, res) {
    if (process.env["TestDB"] && process.env["admin"]) { //jshint ignore:line
        User.remove({},function() {
            res.status(200).end();
        });
    } else {
        res.status(401).json({
            err: "This functionality if for testing only"
        });
    }
};
