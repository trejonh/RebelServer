  var mongoose = require("mongoose");
  var Outlets = mongoose.model("outletDataModel");
  var Devices = mongoose.model("smartDeviceModel");
  var Users = mongoose.model("registeredUserModel");
  var particleRequest = require("request");
  var moment = require('moment');
  var agenda = require('./AgendaController');
  var serverTimeZone = new Date().getTimezoneOffset() / 60;
  module.exports.createOutlet = function(req, res) {
      var data = req.body.data;
      var outlet = {}; //= new Outlets();
      data = data.split(",");
      console.log(data);
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
                  outlet.currentWattage = parseInt(outletData[1].substring(0, outletData[1].indexOf('}')));
                  break;
          }
      }
      Outlets.findOne({
          $and: [{
              deviceID: data.deviceID
          }, {
              outletNumber: data.outletNumber
          }]
      }, function(err, foundOutlet) {
          if (foundOutlet)
              updateOutletData(req, res);
          else {
              var outletObj = new Outlets();
              outletObj.deviceID = outlet.deviceID;
              outletObj.accessToken = outlet.accessToken;
              outletObj.outletNumber = outlet.outletNumber;
              outletObj.nickname = "I am outlet " + outlet.outletNumber;
              outletObj.isOn = outlet.isOn;
              outletObj.currentWattage = outlet.currentWattage;
              outletObj.hourlyWattage = [];
              outletObj.dailyWattage = [];
              outletObj.save(function(err, doc) {
                  if (err) {
                      console.log(err);
                      res.status(500);
                      res.json({
                          "error": err
                      });
                      return;
                  }
                  res.status(200).json({ body: "good" }).end(); //if not sending json or other data need to .end()
                  return;
              });

          }
      });
  };

  module.exports.updateOutletData = function(req, res) {
      var data = req.body.data;
      if (typeof data === 'string') {
          var outlet = {}; //= new Outlets();
          data = data.split(",");
          console.log(data);
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
                      outlet.currentWattage = parseInt(outletData[1].substring(0, outletData[1].indexOf('}')));
                      break;
              }
          }
          data = outlet;
      }
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
              res.status(500).end();
              return;
          } else if (!outlet) {
              console.log("no docs found with id: " + data.deviceID);
              res.json({
                  error: "no docs found with id: " + data.deviceID
              });
              res.status(500).end();

          }
          outlet.currentWattage += data.wattage;
          outlet.save(function(err, raw) {
              if (err) {
                  console.log(err);
                  res.status(500);
                  res.json({
                      "error": err
                  }).end();
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
                      return;
                  } else {
                      res.status(500).json({
                          err: "no device has been created to house this outlet, but data has been saved.",
                          outlet: outlet
                      }).end();
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
      var differenceInTz = req.body.timeZone - serverTimeZone;
      var time = moment({
          hour: req.body.time[0],
          minute: req.body.time[1]
      }).add(differenceInTz, 'hours');
      var hours = new Date(time._d).getHours();
      agenda.cancel(req.body.outletID + ' is scheduled to ' + req.body.method);
      agenda.defineJob(req.body.outletID + ' is scheduled to ' + req.body.method);
      var job = agenda.scheduleJob(req.body.outletID + ' is scheduled to ' + req.body.method, hours, req.body.time[1], req.body);
      res.status(200).json(job);
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
      var method = "PowerOn";
      if (outlet.isOn)
          method = "PowerOff";
      var particleUrl = "https://api.particle.io/v1/devices/";
      particleRequest.post(particleUrl + outlet.deviceID + "/" + method + "?access_token=" + outlet.accessToken, {
          form: {
              args: outlet.outletNumber
          }
      }, function(err, response, body) {
          console.log(err);
          console.log(response);
          console.log(body);
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


  function updateOutletsInDevice(device, res, newOutlet) {
      console.log("trying to update outlets in device");
      var deviceOutlets = device.outlets;
      for (var i = 0; i < deviceOutlets.length; i++) {
          if (deviceOutlets[i].outletNumber === newOutlet.outletNumber) {
              deviceOutlets[i] = newOutlet;
              break;
          }
      }
      Devices.findByIdAndUpdate(device._id, {
          $set: {
              outlets: deviceOutlets,
              lastSeenOnline: (new Date()).toTimeString()
          }
      }, function(err, dev) {
          if (err) {
              if (res) {
                  res.status(500).json({
                      err: err
                  }).end();
              }
              console.log(err);
              return;
          } else if (dev) {
              if (res) {
                  console.log("done updating");
                  res.status(200).json(dev).end();
              }
              return;
          }
      });
  }
