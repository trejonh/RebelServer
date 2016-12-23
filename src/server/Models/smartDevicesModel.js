//setup
var mongoose = require("mongoose");
var SmartDeviceSchema = new mongoose.Schema({
    deviceName: {
        type: String,
        required: false
    },
    owner: {
        type: String,
        required: false
    },
    deviceID: {
        type: String,
        required: true
    },
    outlets: {
        type: [],
        required: true
    },
    lastSeenOnline:{
      type: String,
      required: false
    }
});

//Export the model Schema
//MUST export components
module.exports = mongoose.model("smartDeviceModel", SmartDeviceSchema);
