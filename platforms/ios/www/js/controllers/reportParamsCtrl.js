'use strict';

/**
 * @ngdoc function
 * @name recnaleerfClientApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the recnaleerfClientApp
 */

console.log("init memememem");

angular.module('recnaleerfClientApp')
    .controller('reportParamsCtrl', ['$scope','$location', 'WorkItem', 'Customer','$state', function ($scope,$location,WorkItem,Customer,$state) {

        console.log('memememem');


        $scope.reportCustomer = null;
        $scope.firstItemDate = null;
        $scope.lastItemDate = null;

        $scope.customerSelected = function(customer){
            $scope.reportCustomer = customer;
            populateDateRanges();
        };

        var populateDateRanges = function () {
            WorkItem.getFirstItemDate($scope.currentUser,$scope.reportCustomer).then(function(date) {
                $scope.firstItemDate = date;
                console.log(date);
            }, function(aError) {
                console.log(aError);
            });

            WorkItem.getLastItemDate($scope.currentUser,$scope.reportCustomer).then(function(date) {
                $scope.lastItemDate = date;
                console.log(date);
            }, function(aError) {
                console.log(aError);
            });

            /*
            WorkItem.getAllItemDates().then(function(dates) {

            }, function(aError) {
                console.log(aError);
            });*/
        };

        $scope.prepareAndShowReport = function() {
            var params = {
                customerid : $scope.reportCustomer.id,
                start: $scope.firstItemDate,
                finish: $scope.lastItemDate};

            console.log(params);
            $state.go('tab.reports-bydate',params);
            console.log('state - go us die');


        };

    }]);
