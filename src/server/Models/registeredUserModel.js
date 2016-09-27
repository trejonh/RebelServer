//setup
var mongoose = require("mongoose");
var RegisteredUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
  },
  userName:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  devices:{
    type: Object,
    required: false
  }
});

//Export the model Schema
//MUST export components
module.exports = mongoose.model("registeredUserModel",RegisteredUserSchema);
