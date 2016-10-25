var mongoose = require("mongoose");
var TestMessagesSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    date: {
        type: Object,
        required: true
    },
    deviceID:{
      type: String,
      required: true
    },
    accessToken:{
      type: String,
      required: true
    }
});

TestMessagesSchema.methods.setDate = function(){
  this.date = new Date();
};
module.exports = mongoose.model("testMessagesModel", TestMessagesSchema);
