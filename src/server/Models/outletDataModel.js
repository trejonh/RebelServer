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
        type: Number,
        required: true
    },
    isOn: {
        type: Boolean,
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

OutletDataSchema.methods.setDate = function() {
    this.date = new Date().toString();
};
module.exports = mongoose.model("outletDataModel", OutletDataSchema);
