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
      if (completedFields(registerUser.credentials)) {
        authentication.register(registerUser.credentials).then(function() {
          $location.path("/profile");
        }, function errorCallback() {
          console.log("error saving to db");
        });
      }
    };
  });


function completedFields(credentials) { //jshint ignore:line
  var fName = credentials.name;
  var uName = credentials.username;
  var password = credentials.password;
  fName = fName.trim();
  uName = uName.trim();
  password = password.trim();
  if (!fName || fName.length === 0 || !uName || uName.length === 0)
    return false; //jshint ignore:line
  return true;
}
