var mongoose = require("mongoose");
var OutletDataSchema = new mongoose.Schema({
    deviceID: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    outletNumber: {
        type: Number,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    isOn: {
        type: Number,
        required: true
    },
    wattage: {
        type: Number,
        required: true
    },
    timeSetOn: {
        type: Number,
        required: true
    },
    timeSetOff: {
        type: Number,
        required: true
    },
    elapsedTimeOn: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("outletDataModel", OutletDataSchema);
