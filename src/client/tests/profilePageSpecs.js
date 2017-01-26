// jshint ignore:start
var request = require('request');
describe("Tests profile page functionality and content", function() {
  var EC = protractor.ExpectedConditions;
  var waitTime = 1000 * 100;
  var strongPassword = '6bGF7APO5FYb%h';
  var testData = {
    name: 'Tester McTester',
    password: strongPassword,
    username: 'tester1234'
  };
  var token;

  beforeAll(function(done) {
    request.post('http://localhost:3000/register', {
        form: testData
      },
      function(err, res, body) {
        token = body.token;
        done();
      }); //must use form to post data
  });

  beforeEach(function() {
    browser.get('index.html');
    browser.wait(EC.visibilityOf($('#loginForm')), waitTime);
    browser.executeScript('window.localStorage.setItem("mean-token",' + token + ');');
    element(by.id('usernameInput')).sendKeys(testData.username);
    element(by.id('passwordInput')).sendKeys(testData.password);
    element(by.id('loginBtn')).click();
    //  browser.get('index.html#/profile');
  });

  afterAll(function() {
    request.delete('http://localhost:3000/testing');
  });

  afterEach(function() {
    //  browser.executeScript('window.sessionStorage.clear();');
    browser.executeScript('window.localStorage.clear();');
  });

  jasmine.DEFAULT_TIMEOUT_INTERVAL = waitTime;

  describe("verify content", function() {
    beforeEach(function() {
      browser.get('index.html#/profile');
    });

    it('should have a title', function() {
      expect(browser.getTitle()).toEqual('Rebel Server');
    });

    it('should have profile picture', function() {
      var el = element(by.id('profileImg')).evaluate('profile.user.profileImage');
      console.log(el);
      //expect(el.toBePresent()).toBeTruthy();
    });

    it('should have navbar items', function() {
      expect($$("#pages li").count()).toBe(4);
    });

    it('should have account options items', function() {
      expect($$("#accountOptions li").count()).toBe(4);
    });

    it('log out button should be visible', function() {
      expect(element(by.id("logoutBtn")).getCssValue("display")).toEqual("block");
    });

    it('should welcome user by name', function() {
      var el = element(by.id('welcomeUser')).evaluate('profile.user.name');
      //console.log(el);
      expect(el).toEqual(testData.name);

      //  expect(element(by.id('welcomeUser')).getText()).toEqual('Welcome Tester McTester!');
    });
  });

  describe("verify correct functionality of  profile page", function() {
    beforeAll(function() {
      browser.get('index.html#/profile');
    });

    beforeEach(function() {
      browser.refresh();
    });

    it('should display password modal', function() {
      browser.wait(EC.invisibilityOf($('#changePassModal')), waitTime);
      element(by.id('accountDropdown')).click();
      element(by.id('openChangePassModal')).click();
      browser.wait(EC.visibilityOf($('#changePassModal')), waitTime);
      element(by.id('passwordInput')).sendKeys(testData.password);
      element(by.id('confirmPasswordInput')).sendKeys(testData.password);
      element(by.id('confirmNewPassword')).click();
      browser.wait(EC.invisibilityOf($('#changePassModal')), waitTime);
      browser.wait(EC.visibilityOf($('#updateProfileAlert')), waitTime);
      expect(element(by.binding('profile.updatedProfileMessage')).getText()).toContain('Success! password has been changed.');
      element(by.id('closeProfileAlert')).click();
      browser.wait(EC.invisibilityOf($('#updateProfileAlert')), waitTime);
    });

    it('should display profile image modal', function() {
      browser.wait(EC.invisibilityOf($('#changeProPicModal')), waitTime);
      element(by.id('accountDropdown')).click();
      element(by.id('openChangePiclModal')).click();
      browser.wait(EC.visibilityOf($('#changeProPicModal')), waitTime);
      element(by.id('changeProPicBtn')).click();
      browser.wait(EC.invisibilityOf($('#changeProPicModal')), waitTime);
      browser.wait(EC.invisibilityOf($('#updateProfileAlert')), waitTime);
    });
    //TODO: will be tested manually do to complexity of backend
    /*it('should display device modal', function() {
      browser.wait(EC.invisibilityOf($('#addDeviceModal')), waitTime);
      element(by.id('accountDropdown')).click();
      element(by.id('openAddDevModal')).click();
      browser.wait(EC.visibilityOf($('#addDeviceModal')), waitTime);
      //element(by.id('deviceIdInput')).sendKeys('1234');
      element(by.id('addDeviceBtn')).click();
      browser.wait(EC.invisibilityOf($('#addDeviceModal')), waitTime);
      expect(element(by.binding('profile.updatedProfileMessage')).getText()).toContain('Success! added the following device: 1234');
      element(by.id('closeProfileAlert')).click();
      browser.wait(EC.invisibilityOf($('#updateProfileAlert')), waitTime);
      browser.wait(EC.presenceOf($('table')), waitTime);
    });*/

    it('should delete account', function() {
      browser.wait(EC.invisibilityOf($('#deleteAccountModal')), waitTime);
      element(by.id('accountDropdown')).click();
      element(by.id('openDelModal')).click();
      browser.wait(EC.visibilityOf($('#deleteAccountModal')), waitTime);
      element(by.id('cancelBtn')).click();
      browser.wait(EC.invisibilityOf($('#deleteAccountModal')), waitTime);
      //  browser.wait(EC.not(EC.urlContains('profile')), waitTime);
    });
  });

});
// jshint ignore:end
