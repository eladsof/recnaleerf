'use strict';

/**
 * @ngdoc function
 * @name recnaleerfClientApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the recnaleerfClientApp
 */

console.log("init customerCtrl");

angular.module('recnaleerfClientApp')
    .controller('AccountCtrl', ['$scope','$rootScope','MyUser','$state', function ($scope, $rootScope, MyUser, $state) {

        $scope.logout = function () {
            MyUser.logOut();
            $rootScope.currentUser = MyUser.current();
            $state.go('login');
        }






    }]);
