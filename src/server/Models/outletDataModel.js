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
      required: true
    },
    lastKnownPowerStatus:{
      type: Boolean,
      required:true
    }
});

module.exports = mongoose.model("outletDataModel", OutletDataSchema);
