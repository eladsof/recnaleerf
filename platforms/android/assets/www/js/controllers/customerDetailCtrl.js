'use strict';

/**
 * @ngdoc function
 * @name recnaleerfClientApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the recnaleerfClientApp
 */

angular.module('recnaleerfClientApp')
    .controller('customerDetailCtrl', function($scope, $stateParams, Customer, WorkItem) {
        Customer.getById($stateParams.customerid).then(function(customer) {
            $scope.customer = customer;

            WorkItem.listByCustomer($scope.currentUser,$scope.customer).then(function(aworkItems) {
                $scope.monthlyWorkHours = 0;
                var sum = 0;
                for(var i=0;i<aworkItems.length;i++){
                    sum += aworkItems[i].elapsedTime();
                }
                var hours = Math.floor(sum/(1000 * 60 * 60));
                var minutes = Math.floor((sum - (hours * 60 * 60 * 1000)) / (1000 * 60));
                $scope.monthlyWorkHours = hours + ':' + minutes;


            }, function(aError) {
                console.log(aError);
            });

        }, function(aError) {
            console.log(aError);
        });
    });