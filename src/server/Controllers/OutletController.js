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
      }, '-hash -salt -_id -devices -profileImage -username -phoneNumber -name', function(err, user) {
          if (err) {
              console.log(err);
              res.status(500).json({
                  err: err
              });
              return;
          }
          res.status(200).json(user);
      });
  };
  module.exports.scheduleTask = function(req, res) {
      var schedule = Scheduler.schedule('* '+req.body.time[1]+' '+req.body.time[0]+' * *', togglePowerState(req.body.deviceID, req.body.outletNumber, req.body.access_token, req.body.method, function(err) {
          console.log("init task", req.body.method);
          if (err) {
              console.log(err);
              notifyUser(req.body.deviceObjID, req.body.method, "failed due to " + err);
              return;
          }
          notifyUser(req.body.deviceObjID, req.body.method, "successful");
      }));
      Outlets.findById(req.body.outletID,function(err,outlet){
        if(err){
          console.log(err);
          res.status(500).json({err:err});
          return;
        }else if(outlet){
          if(req.body.method === 'turnOn'){
            if(outlet.onSchedule)
              outlet.onSchedule.destroy();
            outlet.onSchedule = schedule;
          }else{
            if(outlet.offSchedule)
              outlet.offSchedule.destroy();
            outlet.offSchedule = schedule;
          }
          outlet.save(function(){
            Devices.findById(req.body.deviceObjID,function(device){
              updateOutletsInDevice(device,res,outlet);
            });
          });
        }
      });
  };

  module.exports.manualSwitch = function(req, res) {
      Outlets.findById(req.body._id, function(err, outlet) {
          if (err) {
              console.log(err);
              res.status(500).json({
                  err: err
              });
              return;
          } else if (outlet) {
              switchPower(outlet, function(err) {
                  if (err) {
                      console.log(err);
                      res.status(500).json({
                          err: err
                      });
                      return;
                  }
                  if (outlet.isOn) {
                      outlet.isOn = 0;
                  } else {
                      outlet.isOn = 1;
                  }
                  outlet.save(function() {
                      Devices.findOne({
                          $and: [{
                              owner: req.body.username
                          }, {
                              deviceID: outlet.deviceID
                          }]
                      }, function(err, device) {
                          if (device) {
                              updateOutletsInDevice(device, res, outlet);
                          }
                      });
                  });

              });
          }
      });
  };

  function switchPower(outlet, callback) {
      var method = "turnOn";
      if (outlet.isOn)
          method = "turnOff";
      var particleUrl = "https://api.particle.io/v1/devices/";
      particleRequest.post(particleUrl + outlet.deviceID + "/" + method + "?access_token=" + outlet.accessToken, {
          form: {
              args: outlet.outletNumber
          }
      }, function(err, response, body) {
          if (!err && response.statusCode === 200) {
              /*if (req) {
                  updateTasks(req, null);
              }*/
              //notifyUser(idOfDevice, method, " successful");
              if (callback)
                  callback(null);
          } else if (err) {
              //notifyUser(idOfDevice, method, " not successful due to following:\n" + err);
              console.log(err);
              if (callback)
                  callback(err);
          }
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
              if (res) {
                  res.status(500).json({
                      err: err
                  });
              }
              console.log(err);
              return;
          } else if (dev) {
              if (res) {
                  res.status(200).json(dev);
              }
              return;
          }
      });
  }

  function togglePowerState(deviceID, outletNumber, access_token, method, callback) {
      var particleUrl = "https://api.particle.io/v1/devices/";
      particleRequest.post(particleUrl + deviceID + "/" + method + "?access_token=" + access_token, {
          form: {
              args: outletNumber
          }
      }, function(err, response, body) {
          if (!err && response.statusCode === 200) {
              if (callback)
                  callback(null);
          } else if (err) {
              console.log(err);
              if (callback)
                  callback(err);
          }
      });
  }

  function notifyUser(deviceID, method, passedOrFail) {
      Devices.findById(deviceID, function(err, device) {
          if (err) {
              console.log(err);
              return;
          } else if (device) {
              var notification = {
                  timeExecuted: (new Date()).toLocaleString(),
                  device: device.deviceName,
                  message: "",
                  passedOrFail: passedOrFail
              };
              notification.message = "On " + notification.timeExecuted + ", " + notification.device + " tried to " + method + " and was" + passedOrFail;
              Users.findOne({
                  username: device.owner
              }, function(err, user) {
                  if (err) {
                      console.log(err);
                      return;
                  } else if (user) {
                      var userNotifications = user.notifications; //.push(notification);
                      userNotifications.push(notification);
                      Users.findByIdAndUpdate(user._id, {
                          $set: {
                              notifications: userNotifications
                          }
                      }, function(err) {
                          if (err) {
                              console.log(err);
                          }
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
          }
      });
  }
