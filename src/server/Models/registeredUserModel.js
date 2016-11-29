//setup
var mongoose = require("mongoose");
var crypto = require("crypto");//encryption
var jwt = require('jsonwebtoken');//to send token to client for resgistration and loggin in
var RegisteredUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: false
  },
  username:{
    type: String,
    unique: true,
    required: true
  },
  devices:{
    type: Object,
    required: false
  },
  profileImage:{
    type: String,
    required:false
  },
  hash: String,
  salt: String
});
//dont save password to db due to security falts
//instead hash the given password and store hash
//then compare hashes to verify same password was used
RegisteredUserSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64,"SHA1").toString('hex');
};

RegisteredUserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64,"SHA1").toString('hex');
  return this.hash === hash;
};

//RegisteredUserSchema.methods.update

RegisteredUserSchema.methods.generateJwt = function() {
  var expiration = new Date();
  expiration.setDate(expiration.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    username: this.userName,
    exp: parseInt(expiration.getTime() / 1000),
  }, "MY_SECRET"); // DO NOT KEEP SECRET IN THE CODE!
};
//Export the model Schema
//MUST export components registeredUserModel
module.exports = mongoose.model("registeredUserModel",RegisteredUserSchema);
