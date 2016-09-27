//setup
var Resource = require("resourcejs");
module.exports = function(app, route) {
    //setup controller for restful
    Resource(app,"",route,app.models.registeredUserModel).rest();
    //return Middleware
    return function(req, res, next) {
        next();
    };
};
