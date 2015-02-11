'use strict';

/**
 * @ngdoc function
 * @name recnaleerfClientApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the recnaleerfClientApp
 */

angular.module('recnaleerfClientApp')
    .controller('reportByDateCtrl', ['$scope','$stateParams','$window','WorkItem', 'Customer','$ionicLoading','reportCreator', function ($scope,$stateParams,$window,WorkItem,Customer,$ionicLoading,reportCreator) {

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
                    $ionicLoading.hide();
                }).then( function () {
                    calculateSum();
                });
        };

        var calculateSum = function () {
            $scope.workItems.forEach(function(item) {
                $scope.totalItemsSum += item.totalCharge();
                console.log(item.customer.name);
            });
        };

        $scope.exportReport = function () {

            reportCreator.generateReportMail(createReportTitle(),$scope.workItems);
        };

        var createReportTitle = function () {
            var userName = $scope.currentUser.get('username');
            if (userName.match(/[\u0590-\u05FF]+/g))
                userName = userName.split("").reverse().join("");

            var title = 'Work report for ' + userName + ' ';

            title +=  $scope.firstItemDate.toDateString() + ' - ' + $scope.lastItemDate.toDateString();
            return title;

        }


        createReport();

    }]);
