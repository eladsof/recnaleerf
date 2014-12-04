'use strict';

/**
 * @ngdoc function
 * @name recnaleerfClientApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the recnaleerfClientApp
 */

angular.module('recnaleerfClientApp')
    .controller('reportByDateCtrl', ['$scope','$stateParams','WorkItem', 'Customer','$ionicLoading', function ($scope,$stateParams,WorkItem,Customer,$ionicLoading) {

        $scope.customer = null;
        $scope.firstItemDate = new Date($stateParams.start);
        $scope.lastItemDate = new Date($stateParams.finish);
        $scope.workItems = null;
        $scope.totalItemsSum = 0;

        var createReport = function () {
            if($stateParams.customerid)
                createReportForCsutoemr();
            else
                getReportData();

        };

        var createReportForCsutoemr = function () {
            Customer.getById($stateParams.customerid).then(
                function(aCustomer) {
                    $scope.customer = aCustomer;
                    getReportData();
                });
        };

        var getReportData = function () {
            $ionicLoading.show();
            WorkItem.getByDateAndCustomer($scope.currentUser,$scope.customer,$scope.firstItemDate,$scope.lastItemDate).then(
                function (aItems) {
                    $scope.workItems = aItems;
                    $scope.totalItemsSum = 0;
                    calculateSum();
                    $ionicLoading.hide();
                });
        };

        var calculateSum = function () {
            $scope.workItems.forEach(function(item) {
                $scope.totalItemsSum += item.totalCharge();
            });
        };


        createReport();

    }]);
