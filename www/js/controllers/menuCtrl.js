'use strict';

/**
 * @ngdoc function
 * @name recnaleerfClientApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the recnaleerfClientApp
 */
angular.module('recnaleerfClientApp')
    .controller('menuCtrl', ['$scope','$rootScope','$location', 'UserSrv', '$ionicLoading','$state','$translate',function ($scope,$rootScope,$location,UserSrv,$ionicLoading,$state,$translate) {

        var userService = UserSrv;
        $scope.logInErrorMessage = "";

        $scope.isLoggedIn = function() {
            return userService.isLoggedIn();
        };

        var signInSuccess = function(user)
        {

            if(user.emailVerified) {
                $rootScope.currentUser = user;
                $location.path('/#');
                $scope.$apply();
            }
            else {
                $scope.logInErrorMessage = $translate.instant('EMAIL_NOT_VERIFIED');
                user.logOut();
                $rootScope.currentUser = null;
            }
            $ionicLoading.hide();
        };

        var signInError = function(user,error)
        {
            $scope.logInErrorMessage = $translate.instant('LOGIN_ERROR')+': '+error.message;
            $ionicLoading.hide();
        };

        $scope.signin = function (user){
            $scope.logInErrorMessage = "";
            return userService.signin(user,signInSuccess,signInError);

        };

        $scope.logout = function () {
            $scope.logInErrorMessage = "";
            return userService.logout();
        };

        $scope.signup = function (usr) {
            $ionicLoading.show();
            $scope.signUpMessage = null;
            userService.signup(usr,$scope.signUpMessage,$scope.signUpSuccess)
            .then(
                function(newUser) {
                    $scope.signUpSuccess = true;
                    $scope.signUpMessage = $translate.instant('VERIFICATION_EMAIL_SENT');
                    navigator.notification.alert($scope.signUpMessage,null,$translate.instant('REGISTRATION_ALMOST_COMPLETE'));
                    $ionicLoading.hide();
                    $state.go('login');
                },
                function(value) {
                    $scope.signUpSuccess = false;
                    $scope.signUpMessage = $translate.instant('LOGIN_ERROR')+': '+value.error.message;
                    console.log($scope.signUpMessage);
                    $ionicLoading.hide();
                }
            );
        };

        $scope.navClass = function (page) {

            var currentRoute = $location.path().substring(1) || '';
            return page === currentRoute ? 'active' : '';
        };

    }]);

