/*
Will be used only for submodule testing not for dev
*/
var mongoose = require("mongoose");
var Message = mongoose.model("testMessagesModel");
module.exports.setMessage = function(req,res){
  console.log(req);
  console.log(req.body);
  var mess = new Message();
  mess.message = req.body.message;
  mess.deviceID = req.body.deviceID;
  mess.accessToken = req.body.accessToken;
  mess.setDate();
  mess.save(function(err){
    if(err){
      console.log(err);
      return;
    }
    res.status(200);
  });
};

module.exports.readMessage = function(req,res){
  Message
    .findOne()
    .populate("mess").exec(function(err,doc){
      if(err){
        console.log(err);
        res.status(400);
        return;
      }
      res.status(200).json(doc.mess);
    });
};
