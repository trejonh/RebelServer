// jshint ignore:start
var request = require('request');
describe("Tests registeration page functionality and content", function() {
  var EC = protractor.ExpectedConditions;
  var waitTime = 1000 * 100;
  var strongPassword = '6bGF7APO5FYb%h';
  var testData = {
    name: 'Tester McTester',
    password: strongPassword,
    username: 'tester1234'
  };
  jasmine.DEFAULT_TIMEOUT_INTERVAL = waitTime;
  describe("verify content", function() {
    beforeEach(function() {
      browser.get('index.html#/registerUser');
      browser.wait(EC.visibilityOf($('#registerForm')), waitTime);
      //  browser.executeScript('localStorage.clear();');
    });

    afterEach(function() {
      browser.refresh();
    });

    it('should have a title', function() {
      expect(browser.getTitle()).toEqual('Rebel Server');
    });

    it('should have login form', function() {
      expect(element(by.id("registerForm")).isPresent()).toBeTruthy();
    });

    it('should have navbar items', function() {
      expect($$("#pages li").count()).toBe(4);
      //  expect(element(by.id("logoutBtn")).getCssValue("display")).toEqual("none");
    });
  });

  describe("verify correct functionality when user is not defined", function() {
    beforeEach(function() {
      request.delete('http://localhost:3000/testing');
      browser.get('index.html#/registerUser');
      browser.wait(EC.visibilityOf($('#registerForm')), waitTime);
      browser.executeScript('localStorage.clear();');
    });

    afterEach(function() {
      request.delete('http://localhost:3000/testing');
    });

    it("verify alert is visible when name is missing", function() {
      browser.wait(EC.invisibilityOf($('#registerUserAlert')), waitTime);
      element(by.id('registerFormBtn')).click();
      browser.wait(EC.visibilityOf($('#registerUserAlert')), waitTime);
      expect(element(by.id('registerUserAlert')).getText()).toEqual('Please provide your full name.');
    });

    it("verify alert is visible when username is missing", function() {
      browser.wait(EC.invisibilityOf($('#registerUserAlert')), waitTime);
      element(by.id('fullNameInput')).sendKeys('Tester McTester');
      element(by.id('registerFormBtn')).click();
      browser.wait(EC.visibilityOf($('#registerUserAlert')), waitTime);
      expect(element(by.id('registerUserAlert')).getText()).toEqual('Please provide an username that is longer than 7 characters.');
    });

    it("verify alert is visible when password is missing", function() {
      browser.wait(EC.invisibilityOf($('#registerUserAlert')), waitTime);
      element(by.id('fullNameInput')).sendKeys('Tester McTester');
      element(by.id('usernameInput')).sendKeys('tester1234');
      element(by.id('registerFormBtn')).click();
      browser.wait(EC.visibilityOf($('#registerUserAlert')), waitTime);
      expect(element(by.id('registerUserAlert')).getText()).toEqual('Your password is too weak, please work to increase it.');
    });

    it("verify alert is visible when password is too weak", function() {
      browser.wait(EC.invisibilityOf($('#registerUserAlert')), waitTime);
      element(by.id('fullNameInput')).sendKeys('Tester McTester');
      element(by.id('usernameInput')).sendKeys('tester1234');
      element(by.id('passwordInput')).sendKeys('tester1234');
      element(by.id('registerFormBtn')).click();
      browser.wait(EC.visibilityOf($('#registerUserAlert')), waitTime);
      expect(element(by.id('registerUserAlert')).getText()).toEqual('Your password is too weak, please work to increase it.');
    });

    it("verify alert is visible when passwords don't match", function() {
      browser.wait(EC.invisibilityOf($('#registerUserAlert')), waitTime);
      element(by.id('fullNameInput')).sendKeys('Tester McTester');
      element(by.id('usernameInput')).sendKeys('tester1234');
      element(by.id('passwordInput')).sendKeys(strongPassword);
      element(by.id('confirmPasswordInput')).sendKeys('strongPassword');
      element(by.id('registerFormBtn')).click();
      browser.wait(EC.visibilityOf($('#registerUserAlert')), waitTime);
      expect(element(by.id('registerUserAlert')).getText()).toEqual('Your passwords do not match.');
    });

    it("verify user is registered after submittal", function() {
      element(by.id('fullNameInput')).sendKeys(testData.name);
      element(by.id('usernameInput')).sendKeys(testData.username);
      element(by.id('passwordInput')).sendKeys(testData.password);
      element(by.id('confirmPasswordInput')).sendKeys(testData.password);
      element(by.id('registerFormBtn')).click();
      browser.wait(EC.urlContains('profile'), waitTime);
      expect(element(by.id('welcomeUser')).getText()).toEqual('Welcome Tester McTester!');
    });
  });

  describe("verify correct functionality when user is predefined", function() {

    beforeEach(function() {
      browser.get('index.html#/registerUser');
      request.post('http://localhost:3000/register').form(testData);//must use form to post data
      browser.executeScript('localStorage.clear();');
      browser.executeScript('window.localStorage["mean-token"]="";');
      browser.wait(EC.visibilityOf($('#registerForm')), waitTime);
    });

    afterEach(function() {
      request.delete('http://localhost:3000/testing');
      browser.refresh();
    });

    it("verify alert is visible when user is already defined", function() {
      element(by.id('fullNameInput')).sendKeys(testData.name);
      element(by.id('usernameInput')).sendKeys(testData.username);
      element(by.id('passwordInput')).sendKeys(testData.password);
      element(by.id('confirmPasswordInput')).sendKeys(testData.password);
      element(by.id('registerFormBtn')).click();
      expect(element(by.id('registerUserAlert')).getText()).toEqual('Username is already taken.');
      browser.wait(EC.not(EC.urlContains('profile')), waitTime);
    });
  });

});
// jshint ignore:end
