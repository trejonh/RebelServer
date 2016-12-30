  /*
                                  Will be used only for submodule testing not for dev
                                  */
  var mongoose = require("mongoose");
  var Outlets = mongoose.model("outletDataModel");
  var Devices = mongoose.model("smartDeviceModel");
  module.exports.createOutlet = function(req, res) {
      var data = req.body.data;
      var outlet = {}; //= new Outlets();
      data = data.split(",");
      for (var i = 0; i < data.length; i++) {
          var outletData = data[i].split(":");
          /*
           *TODO: only need to parse device id, accessToken, and outlet number and power monitoring stuff
           *everything else can be calculated on the server
           */
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
                  outlet.isOn = parseInt(outletData[1]);
                  break;
              case 4:
                  outlet.wattage = parseInt(outletData[1].substring(0, outletData[1].indexOf('}')));
                  break;
          }
      }

      Devices.find({
          deviceID: outlet.deviceId
      }, function(err, doc) {
          if (err) {
              console.log("this device hasn't been created yet in db");
              return;
          } else if (doc.length === 1) {
              doc[0].lastSeenOnline = (new Date()).toTimeString();
              doc[0].update();
          }
      });
      var outletObj = new Outlets();
      outletObj.deviceID = outlet.deviceID;
      outletObj.accessToken = outlet.accessToken;
      outletObj.outletNumber = outlet.outletNumber;
      outletObj.nickname = "I am outlet " + outlet.outletNumber;
      outletObj.isOn = outlet.isOn;
      outletObj.wattage = outlet.wattage;
      outletObj.elapsedTimeOn = 0;
      outletObj.lastKnownPowerStatus = true;
      outletObj.timeSinceLastUpdate = Date.now();

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
  };

  module.exports.updateOutletData = function(req, res) {
      var data = req.body.data;
      Outlets.find({
          deviceID: data.deviceID,
          outletNumber: data.outletNumber
      }, function(err, doc) {
          if (err) {
              console.log(err);
              res.json(err);
              res.status(500);
              return;
          } else if (doc.length === 0) {
              console.log("no docs found with id: " + data.deviceID);
              res.json({
                  error: "no docs found with id: " + data.deviceID
              });
              res.status(500);

          }
          doc[0].wattage = data.wattage;
          //TODO: verify time
          if (doc[0].lastKnownPowerStatus) {
              doc[0].elapsedTimeOn = Date.now() - doc[0].timeSinceLastUpdate;
              doc[0].timeSinceLastUpdate = Date.now();
          }
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
      });
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
              for (var i = 0; i < outlets.length; i++) {
                  if (outlets[i].lastKnownPowerStatus) {
                      outlets[i].elapsedTimeOn += (Date.now() - outlets[0].timeSinceLastUpdate);
                      outlets[i].timeSinceLastUpdate = Date.now();
                      outlets[i].update();
                  }

              }
              callback(null, outlets);
          }
      });
  };
  module.exports.changeOutletName = function(req, res) {
      var searchQuery = {
          $and: [{
              deviceID: req.body.deviceID
          }, {
              outletNumber: req.body.outletNumber
          }]
      };
      Device.findOne(searchQuery, function(err, outlet) {
          if (err) {
              console.log(err);
              res.status(500);
              res.json(err);
              return;
          } else {
              outlet.nickname = req.body.nickname;
              if (outlet.lastKnownPowerStatus) {
                  outlet.elapsedTimeOn += (Date.now() - outlet.timeSinceLastUpdate);
                  outlet.timeSinceLastUpdate = Date.now();
              }
              outlet.save(function(err, raw) {
                  Devices.findOne({
                      deviceID: req.body.deviceID
                  }, function(err, device) {
                      if (err) {
                          res.status(500).json(err);
                          return;
                      }
                      for (var i = 0; i < device.outlets.length; i++) {
                          if (device.outelets[i].outletNumber === outlet.outletNumber) {
                              device.outlet[i] = outlet;
                              device.save(function(err, raw) {//jshint ignore:line
                                  res.status(200).json(device);
                              });
                          }
                      }
                  });
              });
          }
      });
  };

  module.exports.scheduleTask = function(req, res) {
      var searchQuery = {
          $and: [{
              deviceID: req.body.deviceID
          }, {
              outletNumber: req.body.outletNumber
          }]
      };
      Outlets.find(searchQuery, function(err, outlet) {
          if (err) {
              console.log(err);
              res.status(500);
              res.json(err);
              return;
          } else {
              outlet[0].isOn = req.body.isOn;
              outlet[0].timeSetOn = req.body.timeSetOn;
              outlet[0].timeSetOff = req.body.timeSetOff;
              if (outlet[0].lastKnownPowerStatus) {
                  outlet[0].elapsedTimeOn += (Date.now() - outlet[0].timeSinceLastUpdate);
                  outlet[0].timeSinceLastUpdate = Date.now();
              }
              if (!req.body.isOn) {
                  outlet[0].lastKnownPowerStatus = false;
              } else {
                  outlet[0].lastKnownPowerStatus = true;
                  outlet[0].timeSinceLastUpdate = Date.now();
              }
              outlet[0].update(function() {
                  res.status(200).json(outlet[0]);
              });
          }
      });
  };
