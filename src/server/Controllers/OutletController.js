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
      Outlets.findOne({
          _id: data._id
      }, function(err, outlet) {
          if (err) {
              console.log(err);
              res.json(err);
              res.status(500);
              return;
          } else if (!outlet) {
              console.log("no docs found with id: " + data.deviceID);
              res.json({
                  error: "no docs found with id: " + data.deviceID
              });
              res.status(500);

          }
          outlet.wattage = data.wattage;
          //TODO: verify time
          if (outlet.lastKnownPowerStatus) {
              outlet.elapsedTimeOn = Date.now() - outlet.timeSinceLastUpdate;
              outlet.timeSinceLastUpdate = Date.now();
          }
          outlet.save(function(err, raw) {
              if (err) {
                  console.log(err);
                  res.status(500);
                  res.json({
                      "error": err
                  });
                  return;
              }
              Devices.findOne({
                  deviceID: req.body.deviceID
              }, function(err, device) {
                  if (err) {
                      res.status(500).json(err);
                      return;
                  }
                  for (var i = 0; i < device.outlets.length; i++) {
                      if (device.outlets[i]._id.equals(outlet._id)) { //must use .equals() when comparing Objectids in mongoose
                          device.outlets[i] = outlet;
                          break;
                      }
                  }
                  device.save(function(err, raw) { //jshint ignore:line
                      res.status(200).json(device);
                  });
              });
          });
      });
  };

  module.exports.getOutletData = function(req, res) {
      Outlets
          .findOne({
              _id: req.body._id
          }, function(err, outlet) {
              if (err) {
                  console.log(err);
                  res.status(400).json({
                      error: err
                  });
                  return;
              }
              res.status(200).json(outlet);
          });
  };
  /**
   *this is called when a device is created
   *locally called, not by angular directly
   **/
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
                      outlets[i].elapsedTimeOn += (Date.now() - outlets[i].timeSinceLastUpdate);
                      outlets[i].timeSinceLastUpdate = Date.now();
                      outlets[i].save();
                  }

              }
              callback(null, outlets);
          }
      });
  };
  module.exports.changeOutletName = function(req, res) {
      var searchQuery = {
          _id: req.body._id
      };

      var newOutlet;
      Outlets.findOne(searchQuery, function(err, outlet) {
          if (err) {
              console.log(err);
              res.status(500);
              res.json(err);
              return;
          } else if (outlet) {
              outlet.nickname = req.body.nickname;
              if (outlet.lastKnownPowerStatus) {
                  outlet.elapsedTimeOn += (Date.now() - outlet.timeSinceLastUpdate);
                  outlet.timeSinceLastUpdate = Date.now();
              }
              outlet.save();
              newOutlet = outlet;
          }
      });
      var deviceOutlets = null;
      Devices.findOne({
          $and: [{
              deviceID: req.body.deviceID
          }, {
              owner: req.body.owner
          }]
      }, function(err, device) {
          if (err) {
              console.log(err);
              res.status(500).json({
                  err: err
              });
              return;
          }
          deviceOutlets = device.outlets;
          for (var i = 0; i < deviceOutlets.length; i++) {
              console.log("looking");
              if (deviceOutlets[i].outletNumber === newOutlet.outletNumber) {
                  deviceOutlets[i] = newOutlet;
                  break;
              }
          }
          console.log(device._id);
          Devices.findByIdAndUpdate(device._id, {
              $set: {
                  outlets: deviceOutlets
              }
          }, function(doc) {
              if (doc) {
                  res.status(200).json(doc);
                  console.log(doc);
                  return;
              } else {
                  res.status(500).json({
                      err: "device is null"
                  });
              }
          });
      });
      //console.log("waiting for deviceOutlets");
      //while (deviceOutlets === null) { /*do nothing*/ }
      // //  console.log(deviceOutlets);
      //   for (var i = 0; i < deviceOutlets.length; i++) {
      //     console.log("looking");
      //       if (deviceOutlets[i]._id.equals(newOutlet._id))
      //           deviceOutlets[i] = newOutlet;
      //   }
      //   Devices.findOneAndUpdate({
      //       $and: [{
      //           deviceID: req.body.deviceID
      //       }, {
      //           owner: req.body.owner
      //       }]
      //   }, {
      //       $set: {
      //           outlets: deviceOutlets
      //       }
      //   }, function(device) {
      //       if (device) {
      //           res.status(200).json(device);
      //           console.log(device);
      //           return;
      //       } else {
      //           res.status(500).json({
      //               err: "device is null"
      //           });
      //       }
      //   });

  };

  module.exports.scheduleTask = function(req, res) {
      var searchQuery = {
          _id: req.body._id
      };
      Outlets.findOne(searchQuery, function(err, outlet) {
          console.log("in outlet findone");
          if (err) {
              console.log(err);
              res.status(500);
              res.json(err);
              return;
          } else if (outlet) {
              outlet.isOn = req.body.isOn;
              outlet.nickname = req.body.nickname;
              outlet.timeSetOn = req.body.timeSetOn;
              outlet.timeSetOff = req.body.timeSetOff;
              if (outlet.lastKnownPowerStatus) {
                  outlet.elapsedTimeOn += (Date.now() - outlet[0].timeSinceLastUpdate);
                  outlet.timeSinceLastUpdate = Date.now();
              }
              if (!req.body.isOn) {
                  outlet.lastKnownPowerStatus = false;
              } else {
                  outlet.lastKnownPowerStatus = true;
                  outlet.timeSinceLastUpdate = Date.now();
              }
              outlet.save();
              Devices.findOne({
                  $and: [{
                      deviceID: req.body.deviceID,
                      owner: req.body.owner
                  }]
              }, function(err, device) {
                  console.log("in devices find one");
                  if (err) {
                      res.status(500).json(err);
                      return;
                  }
                  console.log(device.outlets.length);
                  for (var i = 0; i < device.outlets.length; i++) {
                      if (device.outlets[i].outletNumber === outlet.outletNumber) {
                          console.log("found");
                          //http://mongoosejs.com/docs/faq.html for why array wasn't saving
                          //must notify mongoose of change first
                          device.outlets.set(i, outlet);
                          device.markModified("outlets");
                          break;
                      }
                      console.log("not found");
                  }
                  device.save(function(err, raw) { //jshint ignore:line
                      console.log("saved");
                      res.status(200).json(device);
                  });
              });
          } else {
              res.status(500).json({
                  error: "outlet is null"
              });
          }
      });
  };
