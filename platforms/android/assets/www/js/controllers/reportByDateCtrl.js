'use strict';

/**
 * @ngdoc function
 * @name recnaleerfClientApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the recnaleerfClientApp
 */

console.log("init gggggggg");

angular.module('recnaleerfClientApp')
    .controller('reportByDateCtrl', ['$scope','$stateParams','WorkItem', 'Customer', function ($scope,$stateParams,WorkItem,Customer) {

        $scope.customer = null;
        $scope.firstItemDate = new Date($stateParams.start);
        $scope.lastItemDate = new Date($stateParams.finish);
        $scope.workItems = null;
        $scope.totalItemsSum = 0;

        var getCustomer = function () {
            Customer.getById($stateParams.customerid).then(
                function(aCustomer) {
                    $scope.customer = aCustomer;
                    console.log('here i am 1'+$scope.customer);
                    getReportData();
                });
        };

        var getReportData = function () {
            WorkItem.getByDateAndCustomer($scope.customer,$scope.firstItemDate,$scope.lastItemDate).then(
                function (aItems) {
                    $scope.workItems = aItems;
                    $scope.totalItemsSum = 0;
                    calculateSum();
                });
        };

        var calculateSum = function () {
            $scope.workItems.forEach(function(item) {
                $scope.totalItemsSum += item.totalCharge();
            });
        };

//

        getCustomer();

    }]);
