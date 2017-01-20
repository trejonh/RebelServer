var SpecReporter = require('jasmine-spec-reporter').SpecReporter;
exports.config = {
  // The address of a running selenium server.
  directConnect: true,
  seleniumAddress: 'http://localhost:4444/wd/hub',
  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': ['--allow-file-access-from-files']
    }
  },
  baseUrl: 'http://0.0.0.0:9001/',
  onPrepare: function() {
    jasmine.getEnv().addReporter(new SpecReporter({ //jshint ignore:line
      spec: {
        displayStacktrace: true
      }
    }));
  },
  // Spec patterns are relative to the configuration file location passed
  // to protractor (in this example conf.js).
  // They may include glob patterns.
  specs: ['tests/*.js'],

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true, // Use colors in the command line report.
    print: function() {}
  }
};
