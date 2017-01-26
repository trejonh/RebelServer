var request = require("supertest");
var mongoose = require('mongoose');
require("../../server/Models/outletDataModel");
var outletDataModel = mongoose.model('outletDataModel');
describe("test POST operations of outlet controller", function() {
    var server;
    var outletToSave = {
        data: "{deviceID:1234," +
            "accessToken:1234," +
            "outlet:{" +
            "outletNumber:0," +
            "isOn:1," +
            "wattage:687}}"
    };

    beforeEach(function() {
        server = require("../../server/server", {
            bustCache: true
        });
    });

    afterEach(function(done) {
        server.close(done);
    });

    describe("add/update outlets", function() {
        beforeAll(function(done) {
            outletDataModel.findOne()
                .remove()
                .exec();
            done();
        });

        afterAll(function(done) {
            outletDataModel.findOne()
                .remove()
                .exec();
            done();
        });

        it("should add new outlet to db", function(done) {
            var res;
            request(server)
                .post("/createOutlet")
                .send(outletToSave)
                .end(function(err, res) {
                    expect(err).toBeNull();
                    expect(res.status).toEqual(200);
                    done();
                });
        });

        it("should update outlet nickname", function(done) {
            outletDataModel.findOne(function(err, outlet) {
                var data = {
                    _id: outlet._id,
                    nickname: "test outlet"
                };
                request(server)
                    .post("/updateOutletNickname")
                    .send(data)
                    .end(function(err, res) {
                        expect(err).toBeNull();
                        expect(res.status).toEqual(200);
                        expect(res.body.nickname).toEqual(data.nickname);
                        done();
                    });
            });
        });

        it("should update outlet wattage", function(done) {
            outletDataModel.findOne(function(err, outlet) {
                var data = {
                    deviceID: outlet.deviceID,
                    data: {
                        deviceID: outlet.deviceID,
                        outletNumber: outlet.outletNumber,
                        wattage: 800
                    }
                };
                request(server)
                    .put("/updateOutletData")
                    .send(data)
                    .end(function(err, res) {
                        expect(err).toBeNull();
                        expect(res.body.err).toEqual("no device has been created to house this outlet, but data has been saved.");
                        expect(res.status).toEqual(500);
                        expect(res.body.outlet.wattage).toEqual(data.data.wattage);
                        done();
                    });
            });
        });
    });
});
