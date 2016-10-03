'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RegisteruserCtrl
 * @description
 * # RegisteruserCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('RegisteruserCtrl', function($scope, $location, authentication) {
    var registerUser = this;
    registerUser.credentials = {
      name: "",
      username: "",
      email: "",
      password: ""
    };
    $scope.submit = function() {
      authentication.register(registerUser.credentials).then(function() {
        $location.path("/profile");
      }, function errorCallback() {
        console.log("error saving to db");
      });
    };
  });


function isDataComplete(formData) { //jshint ignore:line
  var fName = formData.users.fullname;
  var uName = formData.users.username;
  var password = formData.users.password;
  fName = fName.trim();
  uName = uName.trim();
  password = password.trim();
  console.log(fName);
  console.log(uName);
  console.log(password);
  if (!fName || fName.length === 0 || !uName || uName.length === 0)
    return false; //jshint ignore:line
  return true;
}
