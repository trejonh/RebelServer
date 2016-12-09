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
var ctrlOutlet = require('./Controllers/OutletController');
var ctrlDevice = require('./Controllers/SmartDeviceController');
// profile
router.get('/profile', auth, ctrlProfile.profileRead);
router.delete('/profile', ctrlProfile.profileDelete);
router.put('/profile', ctrlProfile.updateUser);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
//particle test
router.get('/devices', ctrlDevice.getDevices);
router.post('/outletData', ctrlOutlet.setOutletData);
module.exports = router;
