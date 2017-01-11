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
        required: false
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
        type: Object,
        required: false
    },
    timeSetOff: {
        type: Object,
        required: false
    },
    elapsedTimeOn: {
        type: Number,
        required: true
    },
    timeSinceLastUpdate:{
      type: Number,
      required: false
    },
    lastKnownPowerStatus:{
      type: Boolean,
      required:false
    },
    onScheduler:{
      type: Object,
      required:false
    },
    offScheduler:{
      type: Object,
      required:false
    }
});

module.exports = mongoose.model("outletDataModel", OutletDataSchema);
