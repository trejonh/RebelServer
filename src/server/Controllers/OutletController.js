  /*
                                                                  Will be used only for submodule testing not for dev
                                                                  */
  var mongoose = require("mongoose");
  var Outlets = mongoose.model("outletDataModel");
  var Devices = mongoose.model("smartDeviceModel");
  var Scheduler = require("node-schedule");
  var request = require("request");
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
              if (deviceOutlets[i].outletNumber === newOutlet.outletNumber) {
                  deviceOutlets[i] = newOutlet;
                  break;
              }
          }
          Devices.findByIdAndUpdate(device._id, {
              $set: {
                  outlets: deviceOutlets
              }
          }, function(err, dev) {
              if (err) {
                  res.status(500).json({
                      err: err
                  });
                  console.log(err);
                  return;
              } else {
                  res.status(200).json(dev);
                  return;
              }
          });
      });

  };

  module.exports.scheduleTask = function(req, res) {
      var searchQuery = {
          _id: req.body._id
      };
      var host = "https://api.particle.io/v1/devices/" + req.body.deviceID + "/";
      /*request.post(
    'http://www.yoursite.com/formpage',
    { json: { key: 'value' } },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)
        }
    }
);
      */
      if (req.body.manualOn) {
          request.post(host + "turnOn?access_token=" + req.body.access_token, {
              json: {
                  outletNumber: req.body.outletNumber
              }
          }, function(err, response, body) {
              console.log(response);
              console.log(body);
          });
      } else {
          request.post(host + "turnOff?access_token=" + req.body.access_token, {
              json: {
                  outletNumber: req.body.outletNumber
              }
          }, function(err, response, body) {
              console.log(response);
              console.log(body);
          });
      }
      var timeOn = "* " + req.body.onTime[1] + " " + req.body.onTime[0] + " * * *";
      var timeOff = "* " + req.body.offTime[1] + " " + req.body.offTime[0] + " * * *";
      var onScheduler;
      if (req.body.repeatOn) {
          onScheduler = Scheduler.scheduleJob(timeOn, function() {});
      } else {
          onScheduler = Scheduler.scheduleJob(timeOn, function() {
              this.cancel();
          });
      }
      var offScheduler;
      if (req.body.repeatOff) {
          offScheduler = Scheduler.scheduleJob(timeOff, function() {});
      } else {
          offScheduler = Scheduler.scheduleJob(timeOff, function() {
              this.cancel();
          });
      }
      Outlets.findOne({
          _id: req.body._id
      }, function(err, outlet) {
          if (err) {
              console.log(err);
              res.status(500).json({
                  err: err
              });
              return;
          }
          outlet.onScheduler.cancel();
          outlet.offScheduler.cancel();
          Outlets.findByIdAndUpdate(req.body._id, {
              $set: {
                  onScheduler: onScheduler,
                  offScheduler: offScheduler
              }
          }, function(err, doc) {
              if (err) {
                  console.log(err);
                  res.status(500).json({
                      err: err
                  });
                  return;
              } else if (doc) {
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
                          if (deviceOutlets[i].outletNumber === doc.outletNumber) {
                              deviceOutlets[i] = doc;
                              break;
                          }
                      }
                      Devices.findByIdAndUpdate(device._id, {
                          $set: {
                              outlets: deviceOutlets
                          }
                      }, function(err, dev) {
                          if (err) {
                              res.status(500).json({
                                  err: err
                              });
                              console.log(err);
                              return;
                          } else if (dev) {
                              res.status(200).json(dev);
                              return;
                          }
                      });
                  });
              }
          });
      });
  };
