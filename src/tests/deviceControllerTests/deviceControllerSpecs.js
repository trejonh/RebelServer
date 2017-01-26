var request = require("supertest");
var mongoose = require('mongoose');
var atob = require("atob");
require("../../server/Models/smartDevicesModel");
var sdm = mongoose.model('smartDeviceModel');
require("../../server/Models/registeredUserModel");
var userModel = mongoose.model('registeredUserModel');
describe("test getting of device(s)", function() {
    var server;
    var _id;
    var deviceID;
    var userToSave = {
        name: "TreJon House",
        username: "tester",
        email: "tester@testy.com",
        password: "test"
    };
    var searchQuery = {
            username: userToSave.username,
            deviceID: "200042000851353531343431"
        };

    var devices;

    beforeEach(function(done) {
        server = require("../../server/server", {
            bustCache: true
        });

        request(server)
            .post("/register")
            .send(userToSave)
            .end(function(err, res) {
                token = res.body.token;
                payload = token.split('.')[1];
                payload = atob(payload); //atob
                payload = JSON.parse(payload);
                _id = payload._id;
                request(server)
                    .put("/profile")
                    .send({
                        deviceID: searchQuery.deviceID,
                        _id: _id,
                        username: userToSave.username
                    })
                    .end(function(err, res) {
                      devices = res.body.devices;
                        done();
                    });
            });
    });

    afterEach(function(done) {
        userModel.findOne()
            .remove()
            .exec(function() {
                server.close(done);
            });
    });

    describe("get device(s)", function() {
        beforeAll(function() {
          // sdm.findOne(function(err,doc){
          //   console.log(doc);
          //   done();
          // });
        });

        afterAll(function(done) {
            sdm.remove({},function(){
              done();
            });
        });

        it("should get devices", function(done) {
            var res;
            request(server)
                .get("/devices")
                .query(searchQuery)
                .end(function(err, res) {
                    expect(res.body.length).toEqual(1);
                    expect(res.body[0].deviceID).toEqual(searchQuery.deviceID);
                    expect(err).toBeNull();
                    expect(res.status).toEqual(200);
                    done();
                });
        });
    });
});
