var fm = require('./index');

var opts = {
	username: 'yorel56',
	password: 'baritone5',
	host: 'google',
	message: 'Hello from teser linux',
	phoneNumber: '7733696254'
};

fm.sendText(opts, function(info){
	console.log(info);
});
