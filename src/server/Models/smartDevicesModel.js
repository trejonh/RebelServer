//setup
var mongoose = require("mongoose");
var SmartDeviceSchema = new mongoose.Schema({
    deviceName: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: false
    },
    deviceID: {
        type: Number,
        required: true
    },
    outlets: {
        type: Object,
        required: true
    }
});

//Export the model Schema
//MUST export components
module.exports = mongoose.model("smartDeviceModel", SmartDeviceSchema);
