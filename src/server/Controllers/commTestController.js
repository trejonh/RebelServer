  /*
Will be used only for submodule testing not for dev
*/
var mongoose = require("mongoose");
var Message = mongoose.model("testMessagesModel");
module.exports.setMessage = function(req, res) {
    var mess = new Message();
    console.log(req.body.data);
    mess.message = req.body.message + req.body.data;
    mess.deviceID = req.body.deviceID;
    mess.accessToken = req.body.accessToken;
    mess.setDate();
    Message.findOneAndUpdate({
        "deviceID": mess.deviceID
    }, mess, {
        upsert: true
    }, function(err, doc) {
        if (err) {
            console.log(err);
            return;
        }
        res.status(200);
    });
};

module.exports.readMessage = function(req, res) {
    Message
        .findOne({}, {}, { sort: { 'date' : -1 } })
        .populate("mess").exec(function(err, doc) {
            if (err) {
                console.log(err);
                res.status(400);
                return;
            }
            if (doc === null) {
                console.log("doc is null");
                res.status(400);
                return;
            }
            console.log(doc);
            res.status(200).json(doc);
        });
};
