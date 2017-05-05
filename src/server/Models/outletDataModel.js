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
    currentWattage: {
        type: Number,
        required: true
    },
    hourlyWattage: {
        type: [],
        required: false
    },
    dailyWattage: {
        type: [],
        required: false
    },
    lastHourAdded:{
        type: Number,
        required: false
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
