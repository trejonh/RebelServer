  /*
Will be used only for submodule testing not for dev
*/
var mongoose = require("mongoose");
var Message = mongoose.model("testMessagesModel");
module.exports.setMessage = function(req, res) {
    var mess = new Message();
    mess.message = req.body.message;
    mess.deviceID = req.body.deviceID;
    mess.accessToken = req.body.accessToken;
    mess.setDate();
    console.log(mess);
    Message.findOneAndUpdate({
        "deviceID": mess.deviceID
    }, {$set:{
      "message": mess.message,
      "accessToken": mess.accessToken
    }}, {
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
        .findOne({})
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

module.exports.deleteMess = function(req, res) {
    Message.remove({}, function(err){
        if(err){
          console.log(err);
          res.status(400);
          return;
        }
        res.status(200);
        return;
    });
};
