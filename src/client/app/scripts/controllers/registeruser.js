'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RegisteruserCtrl
 * @description
 * # RegisteruserCtrl
 * Controller of the clientApp
 */
var defaultPic = "data:image/png;base64,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";
angular.module('clientApp')
  .controller('RegisteruserCtrl', function($scope, $location, authentication) {
    var registerUser = this;
    $scope.alertHide = true;
    registerUser.credentials = {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      profileImage: ""
    };
    var file;
    var noPic = false;
    $scope.submit = function() {
      if ($scope.profileImage !== null || $scope.profileImage !== undefined) {
        file = $scope.profileImage;
        var reader = new FileReader();
        reader.onload = function() {
          registerUser.credentials.profileImage = reader.result;
          var complete = completedFields(registerUser.credentials);
          if (complete.valid) {
            authentication.register(registerUser.credentials).then(function() {
              $location.path("/profile");
            }, function errorCallback(err) {
              registerUser.error = err.data.error;
              $scope.alertHide = false;
            });
          } else {
            registerUser.error = complete.error;
            $scope.alertHide = false;
          }

        };
        if (file !== undefined) {
          reader.readAsDataURL(file);
        } else {
          noPic = true;
        }
      }
      if (noPic) {
        registerUser.credentials.profileImage = defaultPic;
        var complete = completedFields(registerUser.credentials);
        if (complete.valid) {
          authentication.register(registerUser.credentials).then(function() {
            $location.path("/profile");
          }, function errorCallback(err) {
            registerUser.error = err.data.error;
            $scope.alertHide = false;
          });
        } else {
          registerUser.error = complete.error;
          $scope.alertHide = false;
        }
      }
    };

  });

function completedFields(credentials) { //jshint ignore:line
  var fName = credentials.name;
  var uName = credentials.username;
  var password = credentials.password;
  var confirmPass = credentials.confirmPassword;
  fName = fName.trim();
  uName = uName.trim();
  password = password.trim();
  confirmPass = confirmPass.trim();
  if (!fName || fName.length === 0) {
    return {
      valid: false,
      error: 'Please provide your full name.'
    };
  }
  if (!uName || uName.length <= 7) {
    return {
      valid: false,
      error: 'Please provide an username that is longer than 7 characters.'
    };
  }
  if (parseInt($('p#strength').html()) < 3) { // jshint ignore:line
    return {
      valid: false,
      error: 'Your password is too weak, please work to increase it.'
    };
  }
  if(password !== confirmPass){
    return {
      valid: false,
      error: 'Your passwords do not match.'
    };
  }
  return {
    valid: true
  };
}
