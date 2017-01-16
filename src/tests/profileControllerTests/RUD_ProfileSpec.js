var request = require("supertest");
var mongoose = require('mongoose');
var atob = require("atob");
require("../../server/Models/registeredUserModel");
var userModel = mongoose.model('registeredUserModel');
describe("test CRUD abilities of profile", function() {
    var server;
    var _id;
    var token;
    var payload;
    var userToSave = {
        name: "TreJon House",
        username: "tester",
        email: "tester@testy.com",
        password: "test"
    };

    describe("Remove, Update, and Read capabilities", function() {
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
                    done();
                });
        });

        afterEach(function(done) {
            userModel.findOne()
                .remove()
                .exec(function() {
                    server.close(done);
                });
        });

        it("should not read user", function(done) {
            var res;
            request(server)
                .get("/profile")
                .end(function(err, res) {
                    expect(err).toBeNull();
                    expect(res.status).toEqual(401);
                    done();
                });
        });

        it("should delete the user", function(done) {
            var res;
            request(server)
                .delete("/profile")
                .send({
                    params: {
                        _id: _id
                    }
                })
                .end(function(err, res) {
                    expect(err).toBeNull();
                    expect(res.status).toEqual(200);
                    done();
                });
        });

        it("should not delete the user", function(done) {
            var res;
            request(server)
                .delete("/profile")
                .send({
                    params: {
                        _id: null
                    }
                })
                .end(function(err, res) {
                    userModel.findOne(function(err, doc) {
                        expect(err).toBeNull();
                        expect(doc).not.toBeNull();
                        done();
                    });
                });
        });
    });

    describe("Update user", function() {
        var password;
        var pic;
        var deviceID;

        beforeAll(function(done) {
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
                    userModel.findOne(function(err,doc){
                      password = doc.hash;
                      deviceID = "200042000851353531343431";
                      pic = "a picture";
                      done();
                    });
                });
        });

        afterAll(function(done) {
            userModel.findOne()
                .remove()
                .exec(function() {
                    server.close(done);
                });
        });

        it("should update password",function(done){
          request(server)
            .put("/profile")
            .send({newPassword:"test123",_id:_id})
            .end(function(err,res){
              expect(err).toBeNull();
              expect(res.body.hash).not.toEqual(password);
              expect(res.status).toEqual(200);
              done();
            });
        });

        it("should update pic",function(done){
          request(server)
            .put("/profile")
            .send({newPic:"a picture",_id:_id})
            .end(function(err,res){
              expect(err).toBeNull();
              expect(res.body.profileImage).toEqual(pic);
              expect(res.status).toEqual(200);
              done();
            });
            done();
        });

        it("should add device",function(done){
          request(server)
            .put("/profile")
            .send({deviceID:deviceID,_id:_id})
            .end(function(err,res){
              expect(err).toBeNull();
              expect(res.body.devices[0]).toEqual(deviceID);
              expect(res.status).toEqual(200);
              done();
            });
        });

        it("should add device only once",function(done){
          request(server)
            .put("/profile")
            .send({deviceID:deviceID,_id:_id})
            .end(function(err,res){
              request(server)
                .put("/profile")
                .send({deviceID:deviceID,_id:_id})
                .end(function(err,res){
                  expect(res.body.err).toEqual(undefined);
                  expect(res.body.devices[0]).toEqual(deviceID);
                  expect(res.body.devices.length).toEqual(1);
                  expect(res.status).toEqual(200);
                  done();
                });
            });
        });
    });
});
