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
            return userService.signup(usr);
        };

        $scope.navClass = function (page) {

            var currentRoute = $location.path().substring(1) || '';
            return page === currentRoute ? 'active' : '';
        };

    }]);
/**
 * Created by eladsof on 8/7/14.
 */
