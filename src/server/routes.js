//setup
var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});


var ctrlProfile = require('./Controllers/ProfileController');
var ctrlAuth = require('./Controllers/RegisterUserController');
var ctrlCOutlet = require('./Controllers/OutletController');
// profile
router.get('/profile', auth, ctrlProfile.profileRead);

// authentication
router.post('/register', ctrlAuth.register);
//router.options('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
//particle test
router.get('/particleTest', ctrlCOutlet.getOutletData);
router.post('/outletData', ctrlCOutlet.setOutletData);
module.exports = router;
