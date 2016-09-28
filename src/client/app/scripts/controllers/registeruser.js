'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RegisteruserCtrl
 * @description
 * # RegisteruserCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('RegisteruserCtrl', function($scope, Users, $location) {
    $scope.users = {};
    $scope.submit = function() {
      console.log("trying to post");
      Users.post($scope.users).then(function() {
        console.log("in function to post");
        $location.path("/mySmartDevices");
      });
    };
  });

function isDataComplete(formData) {
  var fName = formData.users.fullname;
  var uName = formData.users.username;
  var password = formData.users.password;
  fName = fName.trim();
  uName = uName.trim();
  password = password.trim();
  console.log(fName);
  console.log(uName);
  console.log(password);
  if (!fName || fName.length == 0 || !uName || uName.length == 0)
    return false;
  return true;
}
