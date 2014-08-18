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
    .controller('customerCtrl', ['$scope','$location', 'CustomerSrv', 'Customer', 'Geolocation', function ($scope,$location,customerSrv,Customer,Geolocation) {

        console.log("init customerCtrl");
        $scope.dist = 'not calced'

        var refreshCustomers  = function() {
            Customer.listByUser($scope.currentUser).then(function(aCustomers) {
                $scope.customers = aCustomers;
                console.log($scope.customers);
            }, function(aError) {
                console.log(aError);
            });
            $scope.customer = {};
        };

        $scope.createNew = function(customer) {
            console.log("Creating a new customer");
            var ret =  customerSrv.createNew(customer);
            refreshCustomers();
            return ret;
        };

        $scope.calc = function(){
             Geolocation.calcuateDistance($scope.customer.address).then(function (distance) { $scope.dist = distance});
        };

        refreshCustomers();

    }]);
