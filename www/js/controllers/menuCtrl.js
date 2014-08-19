'use strict';

/**
 * @ngdoc function
 * @name recnaleerfClientApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the recnaleerfClientApp
 */
angular.module('recnaleerfClientApp')
    .controller('menuCtrl', ['$scope','$location', 'UserSrv' ,function ($scope,$location,UserSrv) {

        var userService = UserSrv;

        $scope.isLoggedIn = function() {
            return userService.isLoggedIn();
        };

        $scope.signin = function (user){
            return userService.signin(user);
        };

        $scope.logout = function () {
            return userService.logout();
        };

        $scope.signup = function (usr) {
            $scope.signUpMessage = "Signing up";
            userService.signup(usr,$scope.signUpMessage,$scope.signUpSuccess)
            .then(
                function(newUser) { $scope.signUpSuccess = true; $scope.signUpMessage = 'User '+newUser.get('username')+' succesfully signed up';console.log($scope.signUpMessage)},
                function(value) {$scope.signUpSuccess = false; $scope.signUpMessage = 'User failed to  signed up: '+value.error.code+':'+value.error.message;;console.log($scope.signUpMessage)}
            );
        };

        $scope.navClass = function (page) {

            var currentRoute = $location.path().substring(1) || '';
            return page === currentRoute ? 'active' : '';
        };

    }]);

