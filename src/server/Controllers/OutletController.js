  var mongoose = require("mongoose");
  var Outlets = mongoose.model("outletDataModel");
  var Devices = mongoose.model("smartDeviceModel");
  var Users = mongoose.model("registeredUserModel");
  var Scheduler = require("node-cron");
  var particleRequest = require("request");
  var sms = require('furious-monkey');
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
          res.status(200).end(); //if not sending json or other data need to .end()
          return;
      });
  };

  module.exports.updateOutletData = function(req, res) {
      var data = req.body.data;
      Outlets.findOne({
          $and: [{
              deviceID: data.deviceID
          }, {
              outletNumber: data.outletNumber
          }]
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
                  } else if (device) {
                      updateOutletsInDevice(device, res, outlet);
                  } else {
                      res.status(500).json({
                          err: "no device has been created to house this outlet, but data has been saved.",
                          outlet: outlet
                      });
                  }
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
              outlet.save(function() {
                  newOutlet = outlet;
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
                      } else if (device) {
                          updateOutletsInDevice(device, res, newOutlet);
                      } else if (process.env["TestDB"]) { //jshint ignore:line
                          res.status(200).json(newOutlet);
                          return;
                      }
                  });
              });
          }
      });

  };

  module.exports.getNotifications = function(req, res) {
      Users.findById({
          _id: req.query._id
      }, function(err, user) {
          if (err) {
              console.log(err);
              res.status(500).json({
                  err: err
              });
              return;
          }
          console.log(user);
          res.status(200).json(user);
      });
  };
  module.exports.scheduleTask = function(req, res) {
      if (req.body.manualOn) {
          triggerPower(req.body.deviceID, req.body.outletNumber, req.body.access_token, res, "turnOn");
      } else {
          triggerPower(req.body.deviceID, req.body.outletNumber, req.body.access_token, res, "turnOff");
      }
  };

  function updateTasks(req, res) {

      var timeOn = "* " + req.body.onTime[1] + " " + req.body.onTime[0] + " * * *";
      var timeOff = "* " + req.body.offTime[1] + " " + req.body.offTime[0] + " * * *";
      var onScheduler;
      if (req.body.repeatOn) {
          onScheduler = Scheduler.scheduleJob(timeOn, function() {
              triggerPower(req.body.deviceID, req.body.outletNumber, req.body.access_token, null, "turnOn");
          });
      } else {
          onScheduler = Scheduler.scheduleJob(timeOn, function() {
              triggerPower(req.body.deviceID, req.body.outletNumber, req.body.access_token, null, "turnOn");
              this.cancel();
          });
      }
      var offScheduler;
      if (req.body.repeatOff) {
          offScheduler = Scheduler.scheduleJob(timeOff, function() {
              triggerPower(req.body.deviceID, req.body.outletNumber, req.body.access_token, null, "turnOff");
          });
      } else {
          offScheduler = Scheduler.scheduleJob(timeOff, function() {
              triggerPower(req.body.deviceID, req.body.outletNumber, req.body.access_token, null, "turnOff");
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
                      updateOutletsInDevice(device, res, doc);
                  });
              }
          });
      });
  }

  function updateOutletsInDevice(device, res, newOutlet) {
      var deviceOutlets = device.outlets;
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
          } else if (dev) {
              res.status(200).json(dev);
              return;
          }
      });
  }

  function triggerPower(deviceID, outletNumber, access_token, res, method) {
      var particleUrl = "https://api.particle.io/v1/devices/";
      particleRequest.post(particleUrl + deviceID + "/" + method + "?access_token=" + access_token, {
          form: {
              args: outletNumber
          }
      }, function(err, response, body) {
          if (!err && response.statusCode === 200) {
              updateTasks(req, res);
              notifyUser(deviceID, method, " successful");
          } else if (err) {
              if (res) {
                  res.status(response.statusCode).json({
                      err: err
                  });
              }
              notifyUser(deviceID, method, " not successful due to following:\n" + err);
              console.log(err);
              return;
          }
      });
  }

  function notifyUser(deviceID, method, passedOrFail) {
      Devices.findOne({
          deviceID: deviceID
      }, function(err, device) {
          if (err) {
              console.log(err);
              return;
          }
          var notification = {
              timeExecuted: (new Date()).toLocaleString(),
              device: device.deviceName | deviceID,
              message: ""
          };
          notification.message = "On " + notification.timeExecuted + ", " + notification.device + " tried to " + method + " and was" + passedOrFail;
          Users.findOne({
              $and: [{
                  deviceID: deviceID
              }, {
                  username: device.owner
              }]
          }, function(err, user) {
              if (err) {
                  console.log(err);
                  return;
              } else {
                  user.notifications.push(notification);
                  user.save(function() {
                      if (user.phoneNumber) {
                          sms.sendText(user.phoneNumber, notification.message, {
                                  subject: "Rebel Kangaroo"
                              },
                              function(err, info) {
                                  if (err) {
                                      console.log(err);
                                  }
                              });
                      }
                  });
              }
          });

      });
  }
