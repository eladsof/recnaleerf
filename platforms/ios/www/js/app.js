// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
app = angular.module('recnaleerfClientApp', ['ionic','ngAutocomplete','geoLocationModule','inputMatch','ngAnimate','positiveFloat','pascalprecht.translate'])

    .run(function($state,$ionicPlatform,$rootScope,MyUser,GlobalSrv) {


        Parse.initialize("p7l1qBjc70dWmM55NIwJoidWx2oP2tCPCJjhYaab", "5vz9eE7fFkWA8ul9SZmqGW1ijiNZ2corgbyBTDmV");
        $rootScope.currentUser = MyUser.current();
        GlobalSrv.initialize();

        // register listener to watch route changes
        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                if (toState.name != 'login' && toState.name != 'signup') {
                    if ( $rootScope.currentUser == null ) {
                        event.preventDefault();
                        $state.go('login');
                    }
                }
            });


        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });

    })

    .config(function($stateProvider, $urlRouterProvider,$translateProvider) {

        $translateProvider.translations('he',translationsHE);
        $translateProvider.preferredLanguage('he');

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            // login state:
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'menuCtrl'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'templates/user-new.html',
                controller: 'menuCtrl'
            })
            // setup an abstract state for the tabs directive
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html"
            })

            // Each tab has its own nav history stack:

            .state('tab.dash', {
                url: '/dash',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-dash.html',
                        controller: ''
                    }
                }
            })

            .state('tab.customers', {
                url: '/customers',
                views: {
                    'tab-customers': {
                        templateUrl: 'templates/tab-customers.html',
                        controller: 'customerCtrl'
                    }
                }
            })
            .state('tab.customer-detail', {
                url: '/customer/:customerid',
                views: {
                    'tab-customers': {
                        templateUrl: 'templates/customer-detail.html',
                        controller: 'customerDetailCtrl'
                    }
                }
            })
            .state('tab.customer-new', {
                url: '/customer/new/:customerid',
                views: {
                    'tab-customers': {
                        templateUrl: 'templates/customer-new.html',
                        controller: 'customerCtrl'
                    }
                }
            })
            .state('tab.customer-edit', {
                url: '/customer/edit/:customerid',
                views: {
                    'tab-customers': {
                        templateUrl: 'templates/customer-new.html',
                        controller: 'customerEditCtrl'
                    }
                }
            })
            .state('tab.reports', {
                url: '/reports',
                views: {
                    'tab-reports': {
                        templateUrl: 'templates/tab-reports.html',
                        controller: 'reportParamsCtrl'
                    }
                }
            })
            .state('tab.reports-bydate', {
                url: '/reports/bydate/:customerid/:start/:finish',
                views: {
                    'tab-reports': {
                        templateUrl: 'templates/reports-bydate.html',
                        controller: 'reportByDateCtrl'
                    }
                }
            })
            .state('tab.account', {
                url: '/account',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/tab-account.html',
                        controller: 'AccountCtrl'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/dash');

    });

app.filter('range', function() {
    return function(input, min, max) {
        min = parseInt(min);
        max = parseInt(max);
        for (var i=min; i<=max; i++)
            input.push(i);
        return input;
    };
});