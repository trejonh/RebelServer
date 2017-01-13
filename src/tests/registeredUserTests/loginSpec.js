var request = require("supertest");
var mongoose = require('mongoose');
//mongoose.createConnection("mongodb://localhost/tests");
require("../../server/Models/registeredUserModel");
var userModel = mongoose.model('registeredUserModel');
//require = require("really-need");
describe("test authentication service", function() {
    var server;
    var userToSave = {
        name: "TreJon House",
        username: "tester",
        email: "tester@testy.com",
        password: "test"
    };
    var correctLogin = {
      username: "tester",
      password:"test"
    };
    var badPassword = {
      username: "tester",
      password:"badpass"
    };
    var badUsername = {
      username: "test",
      password:"test"
    };
    beforeEach(function() {
        server = require("../../server/server", {
            bustCache: true
        });
    });

    afterEach(function(done) {
        server.close(done);
    });

    describe("Login user to server", function() {
        beforeEach(function(done) {
          request(server)
              .post("/register")
              .send(userToSave)
              .end(function(err, res) {
                  done();
              });
        });

        afterEach(function(done) {
            userModel.findOne()
            .remove()
            .exec();
            done();
        });

        it("login correctly", function(done) {
            var res;
            request(server)
                .post("/login")
                .send(correctLogin)
                .end(function(err, res) {
                  expect(res.status).toEqual(200);
                  expect(res.token).not.toBeNull();
                    done();
                });
        });
    });

    describe("Fail to login user to server", function() {
        beforeEach(function(done) {
          request(server)
              .post("/register")
              .send(userToSave)
              .end(function(err, res) {
                  done();
              });
        });

        afterEach(function(done) {
            userModel.findOne()
            .remove()
            .exec();
            done();
        });

        it("should not login due to badPassword", function(done) {
            var res;
            request(server)
                .post("/login")
                .send(badPassword)
                .end(function(err, res) {
                  expect(res.status).toEqual(401);
                  expect(res.text.includes("Password is wrong")).toBeTruthy();
                  expect(res.token).toEqual(undefined);
                    done();
                });
        });

        it("should not login due to badUsername", function(done) {
            var res;
            request(server)
                .post("/login")
                .send(badUsername)
                .end(function(err, res) {
                  expect(res.status).toEqual(401);
                  expect(res.text.includes("User not found")).toBeTruthy();
                  expect(res.token).toEqual(undefined);
                    done();
                });
        });
    });
});
