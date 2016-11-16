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
var ctrlComms = require('./Controllers/commTestController');
// profile
router.get('/profile', auth, ctrlProfile.profileRead);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
//particle test
router.get('/particleTest', ctrlComms.readMessage);
router.post('/particleTest', ctrlComms.setMessage);
router.delete('/particleTest', ctrlComms.deleteMess);
module.exports = router;
