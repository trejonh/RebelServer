  /*
Will be used only for submodule testing not for dev
*/
var mongoose = require("mongoose");
var Message = mongoose.model("testMessagesModel");
module.exports.setMessage = function(req, res) {
    console.log(req);
    console.console.log("========================tcp===================");
    req.TCP.onread(function(data){
      console.log(data);
    });
    console.log("==================================================");
    console.log(req.Route.stack[0]);/*
    var mess = new Message();
    mess.message = req.body.message;
    mess.deviceID = req.body.deviceID;
    mess.accessToken = req.body.accessToken;
    mess.setDate();
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
    });*/
    res.status(200);
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
                var emptyDoc = {};
                //just for testing
                res.status(200).json(emptyDoc);
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
