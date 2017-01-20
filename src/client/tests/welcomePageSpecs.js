// jshint ignore:start
describe("Tests homepage functionality and content", function() {
  var EC = protractor.ExpectedConditions;
  var waitTime = 1000 * 100;
  jasmine.DEFAULT_TIMEOUT_INTERVAL = waitTime;
  beforeEach(function() {
    browser.get('index.html');
  });
  describe("verify content", function() {

    it('should have a title', function() {
      expect(browser.getTitle()).toEqual('Rebel Server');
    });

    it('should have login form', function() {
      expect(element(by.id("loginForm")).isPresent()).toBeTruthy();
    });

    it('should have navbar items', function() {
      expect($$("#pages li").count()).toBe(4);
      /*$$("#pages li").each(function(ele, index) {
        browser.wait(EC.elementToBeClickable(ele), waitTime);
      });*/
      expect(element(by.id("logoutBtn")).getCssValue("display")).toEqual("none");
    });

    it("should go back to welcome page if not logged in", function() {
      browser.get('index.html#/profile');
      browser.wait(EC.not(EC.urlContains('profile')), waitTime);
      expect(browser.getLocationAbsUrl()).toMatch("/");
      browser.wait(EC.not(EC.urlContains('mydevices')), waitTime);
      expect(browser.getLocationAbsUrl()).toMatch("/");
      browser.wait(EC.not(EC.urlContains('about')), waitTime);
      expect(browser.getLocationAbsUrl()).toMatch("/");
    });

  });

  describe("verify functionality", function() {
    beforeAll(function() {
      browser.wait(EC.visibilityOf($('#loginForm')), waitTime);
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
  });
});
// jshint ignore:end
