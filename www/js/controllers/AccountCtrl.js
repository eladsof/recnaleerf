'use strict';

/**
 * @ngdoc function
 * @name recnaleerfClientApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the recnaleerfClientApp
 */

angular.module('recnaleerfClientApp')
    .controller('AccountCtrl', ['$scope','$rootScope','MyUser','$state', function ($scope, $rootScope, MyUser, $state) {

        $scope.logout = function () {
            if(MyUser.logOut()) {
                $rootScope.currentUser = null;
                $state.go('login');
            }
        }
    }]);
