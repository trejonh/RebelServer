  /*
            Will be used only for submodule testing not for dev
            */
  var mongoose = require("mongoose");
  var Outlets = mongoose.model("outletDataModel");
  module.exports.setOutletData = function(req, res) {
      var data = req.body.data;
      var outlet = new Outlets();
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
      //console.log(outlet);
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
              outlet.save(function(err, doc) {
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
          })
          .populate("outlet").exec(function(err, doc) {
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

  module.exports.getOutlets = function(deviceID, callback) {
      console.log("getting outlets");
      Outlets.find({
          deviceID: deviceID
      }).lean().exec(function(err, outlets) {
          if (err) {
              console.log(err);
              callback(err,null);
          } else {
              console.log(outlets);
              callback(null,outlets);
          }
      });
  };
