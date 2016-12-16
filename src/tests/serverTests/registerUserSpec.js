var request = require("supertest");
var mongoose = require('mongoose');
mongoose.createConnection("mongodb://localhost/tests");
require("../../server/Models/registeredUserModel");
var userModel = mongoose.model('registeredUserModel');
//require = require("really-need");
describe("test CRUD abilities of users db", function() {
    var server;
    var userToSave = {
        name: "TreJon House",
        username: "tester",
        email: "tester@testy.com",
        password: "test"
    };

    beforeEach(function() {
        server = require("../../server/server", {
            bustCache: true
        });
    });

    afterEach(function(done) {
        server.close(done);
    });

    describe("add users to db", function() {
        beforeEach(function(done) {
            userModel.findOne()
            .remove()
            .exec();
            done();
        });

        afterEach(function(done) {
            userModel.findOne()
            .remove()
            .exec();
            done();
        });

        it("should add new user to db", function(done) {
            var res;
            request(server)
                .post("/register")
                .send(userToSave)
                .end(function(err, res) {
                    expect(err).toBeNull();
                    expect(res.status).toEqual(200);
                    done();
                });
        });
    });
});
