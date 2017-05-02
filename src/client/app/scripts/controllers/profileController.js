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
    $scope.profileUpdate = true;
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
    profile.newNumber = {
      phoneNumber: "",
      _id: "",
      username: ""
    };
    meanData.getProfile()
      .then(function(data) {
        profile.user = data.data;
        deviceService.getDevices(profile.user.username, null).then(function(data) {
          console.log(data);
          $scope.devices = data.data;
        }, function error(err) {
          if (err) {
            console.log(err);
          }
        });
      }, function error(e) {
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
        $scope.profileUpdate = false;
        profile.updatedProfileMessage = "password has been changed.";
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
          authentication.changeProfilImg(profile.pic);
          $scope.profileUpdate = false;
          profile.updatedProfileMessage = "profile picture has been changed";
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
        deviceService.getDevices(profile.user.username, null).then(function(data) {
          $scope.devices = data.data.devices;
          $scope.profileUpdate = false;
          profile.updatedProfileMessage = "added the following device: " + profile.addDevice.deviceID;
        }, function error(err) {
          if (err) {
            console.log(err);
          }
        });
      });
    };
    $scope.updatePhoneNumber = function() {
      $("#updatePhoneNumberModal").modal("hide"); // jshint ignore:line
      $("#updatePhoneNumberModal").on("hidden.bs.modal", function(eve) { //jshint ignore:line
        profile.newNumber.username = profile.user.username;
        profile.newNumber._id = profile.user._id;
        authentication.updatePhoneNumber(profile.newNumber);
        $scope.profileUpdate = false;
        profile.updatedProfileMessage = "updated phone number.";
      });
    };
  });
