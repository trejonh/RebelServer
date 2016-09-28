// set up ========================
const DATABASE = "mongodb://localhost/smartHomeDevices";
var express = require("express");
var mongoose = require("mongoose"); //require monogDB Driver
var morgan = require("morgan"); // log requests to the console (express4)
var bodyParser = require("body-parser"); // pull information from HTML POST (express4)
var methodOverride = require("method-override"); // simulate DELETE and PUT (express4)
var _ = require("lodash")
    //Create App
var app = express();
//Add Middleware for REST API
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json);
app.use(methodOverride("X-HTTP-Method-Override"));
//CORS Support, makes API Public
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});
// Connect to the db
mongoose.connect(DATABASE);
mongoose.connection.once("open", function() {
    app.models = require("./Models/moduleIndex");
    //registering routes
    var routes = require("./routes");
    _.each(routes, function(controller, route) {
        app.use(route, controller(app, route));
    });
    app.listen(3000);
    console.log("Listening on 3000");
});
