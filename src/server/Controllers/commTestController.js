  /*
  Will be used only for submodule testing not for dev
  */
  var mongoose = require("mongoose");
  var Message = mongoose.model("testMessagesModel");
  module.exports.setMessage = function(req, res) {
      var data = req.body.data;
      var outlet = {
          deviceID: 0,
          outletNumber: 0,
          nickname: "",
          isOn: false,
          wattage: 0,
          timeSetOn: 0,
          timeSetOff: 0,
          elapsedTimeOn: 0
      };
      data = data.split(",");
      for (var i = 0; i < data.length; i++) {
          var outletData = data[i].split(":");
          switch (i) {
              case 0:
                  outlet.deviceID = parseInt(outletData[1]);
                  break;
              case 1:
                  outlet.outletNumber = parseInt(outletData[2]);
                  break;
              case 2:
                  outlet.nickname = outletData[1];
                  break;
              case 3:
                  outlet.isOn = parseInt(outletData[1]);
                  break;
              case 4:
                  outlet.timeSetOn = parseInt(outletData[1]);
                  break;
              case 5:
                  outlet.timeSetOff = parseInt(outletData[1]);
                  break;
              case 6:
                  outlet.elapsedTimeOn = parseInt(outletData[1]);
                  break;
          }
      }
      console.log(outlet);
      /*
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
      Message.remove({}, function(err) {
          if (err) {
              console.log(err);
              res.status(400);
              return;
          }
          res.status(200);
          return;
      });
  };
