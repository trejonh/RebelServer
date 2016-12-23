  /*
                    Will be used only for submodule testing not for dev
                    */
  var mongoose = require("mongoose");
  var Outlets = mongoose.model("outletDataModel");
  var Devices = mongoose.model("smartDeviceModel");
  module.exports.setOutletData = function(req, res) {
      var data = req.body.data;
      var outlet = {}; //= new Outlets();
      data = data.split(",");
      for (var i = 0; i < data.length; i++) {
          var outletData = data[i].split(":");
          //  console.log(outletData);
          switch (i) {
              case 0:
                  outlet.deviceID = outletData[1].trim();
                  break;
              case 1:
                  outlet.accessToken = outletData[1].trim();
                  break;
              case 2:
                  outlet.outletNumber = parseInt(outletData[2]);
                  break;
              case 3:
                  outlet.nickname = outletData[1];
                  break;
              case 4:
                  outlet.isOn = parseInt(outletData[1]);
                  break;
              case 5:
                  outlet.wattage = parseInt(outletData[1]);
                  break;
              case 6:
                  outlet.timeSetOn = parseInt(outletData[1]);
                  break;
              case 7:
                  outlet.timeSetOff = parseInt(outletData[1]);
                  break;
              case 8:
                  outlet.elapsedTimeOn = parseInt(outletData[1].substring(0, outletData[1].indexOf('}')));
                  break;
          }
      }

      Devices.find({
          deviceID: outlet.deviceId
      }, function(err, doc) {
          if (err) {
              console.log("this device hasn't been created yet in db");
              return;
          } else if (doc.length !== 0) {
              doc[0].lastSeenOnline = (new Date()).toTimeString();
              doc[0].update();
          }
      });
      Outlets.find({
          deviceID: outlet.deviceID,
          outletNumber: outlet.outletNumber
      }, function(err, doc) {
          if (err) {
              console.log(err);
              res.json(err);
              res.status(500);
              return;
          }
          if (doc.length === 0) {
              var outletObj = new Outlets();
              outletObj.deviceID = outlet.deviceID;
              outletObj.accessToken = outlet.accessToken;
              outletObj.outletNumber = outlet.outletNumber;
              outletObj.nickname = outlet.nickname;
              outletObj.isOn = outlet.isOn;
              outletObj.wattage = outlet.wattage;
              outletObj.timeSetOn = outlet.timeSetOn;
              outletObj.timeSetOff = outlet.timeSetOff;
              outletObj.elapsedTimeOn = outlet.elapsedTimeOn;

              outletObj.save(function(err, doc) {
                  if (err) {
                      console.log(err);
                      res.status(500);
                      res.json({
                          "error": err
                      });
                      return;
                  }
                  res.status(200);
              });
          } else {
              doc[0].nickname = outlet.nickname;
              doc[0].isOn = outlet.isOn;
              doc[0].wattage = outlet.wattage;
              doc[0].timeSetOn = outlet.timeSetOn;
              doc[0].timeSetOff = outlet.timeSetOff;
              doc[0].elapsedTimeOn = outlet.elapsedTimeOn;
              doc[0].update(function(err, doc) {
                  if (err) {
                      console.log(err);
                      res.status(500);
                      res.json({
                          "error": err
                      });
                      return;
                  }
                  res.status(200);
              });
          }
      });
      res.status(200);
  };

  module.exports.getOutletData = function(req, res) {
      Outlets
          .findOne({
              deviceID: req.body.deviceID
          }).sort({
              outletNumber: 'asc'
          })
          .exec(function(err, doc) {
              if (err) {
                  console.log(err);
                  res.status(400);
                  return;
              }
              res.status(200).json(doc);
          });
  };

  module.exports.getOutlets = function(deviceID, callback) {
      Outlets.find({
          deviceID: deviceID
      }).sort({
          outletNumber: 'asc'
      }).lean().exec(function(err, outlets) {
          if (err) {
              console.log(err);
              callback(err, null);
          } else {
              callback(null, outlets);
          }
      });
  };
  module.exports.changeOutletName = function(req, res) {
      var searchQuery = {$and:[{
          deviceID: req.body.deviceID},
          {outletNumber: req.body.outletNumber}]
      };
      Device.find(searchQuery,function(err, outlet) {
          if (err) {
              console.log(err);
              res.status(500);
              res.json(err);
              return;
          }
          else{
            outlet[0].nickname = req.body.nickname;
            outlet[0].update();
          }
      });
  };

  module.exports.scheduleTask = function(req, res) {
      var searchQuery = {$and:[{
          deviceID: req.body.deviceID},
          {outletNumber: req.body.outletNumber}]
      };
      Device.find(searchQuery,function(err, outlet) {
          if (err) {
              console.log(err);
              res.status(500);
              res.json(err);
              return;
          }
          else{
            outlet[0].isOn = req.body.isOn;
            outlet[0].update();
          }
      });
  };
