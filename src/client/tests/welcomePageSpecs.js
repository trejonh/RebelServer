// jshint ignore:start
describe("Tests homepage functionality and content", function() {
  var EC = protractor.ExpectedConditions;
  var waitTime = 1000 * 100;
  jasmine.DEFAULT_TIMEOUT_INTERVAL = waitTime;
  describe("verify content", function() {
    beforeEach(function() {
      browser.get('index.html');
      browser.executeScript('localStorage.clear();');
    });

    it('should have a title', function() {
      expect(browser.getTitle()).toEqual('Rebel Server');
    });

    it('should have login form', function() {
      expect(element(by.id("loginForm")).isPresent()).toBeTruthy();
    });

    it('should have navbar items', function() {
      expect($$("#pages li").count()).toBe(4);
      expect(element(by.id("logoutBtn")).getCssValue("display")).toEqual("none");
    });

    it("should go back to welcome page if not logged in", function() {
      element(by.linkText('My Profile')).click()
      browser.wait(EC.not(EC.urlContains('profile')), waitTime);
      element(by.linkText('My Devices')).click()
      browser.wait(EC.not(EC.urlContains('mydevices')), waitTime);
      browser.get('index.html#/mydevices/1234/stats');
      browser.wait(EC.not(EC.urlContains('mydevices/1234/stats')), waitTime);
    });

  });

  describe("verify functionality", function() {
    beforeAll(function() {
      browser.wait(EC.visibilityOf($('#loginForm')), waitTime);
    });
    beforeEach(function() {
      browser.get('index.html');
      browser.executeScript('localStorage.clear();');
    });

    it("should not login user in", function() {
      browser.wait(EC.invisibilityOf($('#loginFailure')), waitTime);
      element(by.id('usernameInput')).sendKeys('tester');
      element(by.id('passwordInput')).sendKeys('test');
      element(by.id('loginBtn')).click();
      browser.wait(EC.visibilityOf($('#loginFailure')), waitTime);
      element(by.id('alertClose')).click();
      browser.wait(EC.invisibilityOf($('#loginFailure')), waitTime);
    });

    it("should navigate to about page", function() {
      element(by.linkText('About')).click()
      expect(browser.getCurrentUrl()).toMatch('/about');
    });

    it("should navigate to registeration page", function() {
      element(by.linkText('Register')).click()
      expect(browser.getCurrentUrl()).toMatch('/registerUser');
    });
  });
});
// jshint ignore:end
