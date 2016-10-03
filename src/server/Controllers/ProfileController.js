var mongoose = require('mongoose');
var User = mongoose.model('registeredUserModel');

module.exports.profileRead = function(req, res) {

  // If no user ID exists in the JWT return a 401
  if (!req.payload._id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    // Otherwise continue
    User
      .findById(req.payload._id)
      .exec(function(err, user) {
        if(err){
          console.log(err);
          console.log("finding user went wrong");
        }
        res.status(200).json(user);
      });
  }
};
