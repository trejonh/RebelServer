'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RegisteruserCtrl
 * @description
 * # RegisteruserCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ProfileCtrl', function($scope, $location, meanData, authentication, deviceService) {
    var profile = this;
    profile.user = {};
    $scope.devices = [];
    profile.password = {
      newPassword: "",
      newConfirmPassword: "",
      _id: ""
    };
    profile.pic = {
      newPic: "",
      _id: ""
    };
    profile.addDevice = {
      deviceID: "",
      _id: "",
      username: ""
    };
    meanData.getProfile()
      .success(function(data) {
        profile.user = data;
        deviceService.getDevices(profile.user.username);
        $scope.devices = deviceService.devices;
      })
      .error(function(e) {
        console.log(e);
      });
    $scope.logout = function() {
      authentication.logout();
    };
    $scope.deleteAccount = function() {
      $("#deleteAccountModal").modal("hide"); // jshint ignore:line
      $("#deleteAccountModal").on("hidden.bs.modal", function(eve) { //jshint ignore:line
        authentication.deleteAccount(profile.user._id);
        $location.path("/");

      });
    };
    $scope.changePassword = function() {
      $("#changePassModal").modal("hide"); // jshint ignore:line
      $("#changePassModal").on("hidden.bs.modal", function(eve) { //jshint ignore:line
        profile.password._id = profile.user._id;
        authentication.changePassword(profile.password);
        alert("Password has been changed"); //jshint ignore:line
      });
    };
    $scope.changePropic = function() {
      $("#changeProPicModal").modal("hide"); // jshint ignore:line
      $("#changeProPicModal").on("hidden.bs.modal", function(eve) { //jshint ignore:line
        profile.pic._id = profile.user._id;
        var file = $scope.newPic;
        var reader = new FileReader();
        reader.onload = function() {
          profile.user.profileImage = reader.result;
          profile.pic.newPic = reader.result;
          profile.pic._id = profile.user._id;
          authentication.changePassword(profile.pic);
        };
        if (file !== undefined) {
          reader.readAsDataURL(file);
        }
      });
    };
    $scope.addDevice = function() {
      $("#addDeviceModal").modal("hide"); // jshint ignore:line
      $("#addDeviceModal").on("hidden.bs.modal", function(eve) { //jshint ignore:line
        profile.addDevice.username = profile.user.username;
        profile.addDevice._id = profile.user._id;
        deviceService.addDevice(profile.addDevice);
        deviceService.getDevices(profile.user.username);
        $scope.devices = deviceService.devices;
      });
    };
  });
