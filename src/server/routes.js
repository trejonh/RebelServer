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
var ctrlTest = require('./Controllers/TestController');
// profile
router.get('/profile', auth, ctrlProfile.profileRead);
router.delete('/profile', ctrlProfile.profileDelete);
router.put('/profile', ctrlProfile.updateUser);
router.delete('/note',ctrlProfile.removeNote);

//notifications;
router.get('/notifications', ctrlOutlet.getNotifications);

// user data
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

//device and outlet data
router.get('/devices', ctrlDevice.getDevices);
router.get('/outlets',ctrlOutlet.getOutlets);
router.get('/outletDataRetrival',ctrlOutlet.getOutletData);
router.post('/createOutlet', ctrlOutlet.createOutlet);
router.put('/updateOutlet', ctrlOutlet.updateOutletData);
router.post('/updateOutletNickname',ctrlOutlet.changeOutletName);
router.post('/scheduleTask',ctrlOutlet.scheduleTask);
router.post('/manualSwitch',ctrlOutlet.manualSwitch);
router.post('/changeDeviceName',ctrlDevice.changeDeviceName);
//for testing purpose only
router.delete('/testing',ctrlTest.delete);
module.exports = router;
