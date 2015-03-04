// Karma configuration
// Generated on Mon Mar 02 2015 14:58:51 GMT+0200 (IST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: 'www',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        "http://www.parsecdn.com/js/parse-1.2.19.min.js",
        "lib/ionic/js/ionic.min.js",
        "lib/ionic/js/angular_13/angular.min.js",
        "lib/ionic/js/angular_13/angular-animate.min.js",
        "lib/ionic/js/angular_13/angular-sanitize.min.js",
        "lib/ionic/js/angular_13/angular-sanitize.min.js",
        "lib/ionic/js/angular-ui/angular-ui-router.min.js",
        "lib/angular-mocks/angular-mocks.js",
        "lib/ionic/js/ionic-angular.min.js",
        "lib/ionic/js/angular_13/angular-route.min.js",
        "lib/lodash.js",
        "lib/jspdf.debug.js",
        "lib/jspdf.plugin.autotable.js",
        "js/directives/autocomplete.js",
        "lib/ionic/js/angular_13/angular-translate.min.js",
        "js/directives/ngAutocomplete.js",
        "js/services/geoLocation.js",
        "js/directives/inputmatch.js",
        "js/directives/numberInput.js",

        "js/**/*.js",

//      'lib/ionic/**/*.js',
//      'js/*.js',
      'test/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
