'use strict';

/**
 * @ngdoc function
 * @name recnaleerfClientApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the recnaleerfClientApp
 */

angular.module('recnaleerfClientApp')
    .controller('reportParamsCtrl', ['$scope','$location', 'WorkItem', 'Customer','$state','$ionicLoading', function ($scope,$location,WorkItem,Customer,$state,$ionicLoading) {

        $scope.years = [2010,2011,2012,2013,2014,2015];

        $scope.formData = {};
        $scope.formData.repYear = $scope.years[new Date().getYear() - 110]; // The years start counting at 1900, our array starts at 2010, so... -110
        $scope.formData.repMonth = new Date().getMonth() + 1;
        $scope.currentYear = new Date().getYear();
        
        var updateDatesForMonthReport = function () {
            var startDate = new Date();
            startDate.setHours(0);
            startDate.setMinutes(0);
            startDate.setSeconds(1)
            startDate.setYear($scope.formData.repYear);
            startDate.setMonth($scope.formData.repMonth-1); // The -1 is the only way i got it to work....
            startDate.setDate(1);
            $scope.formData.firstItemDate = startDate;

            var endDate = new Date();
            endDate.setHours(23);
            endDate.setMinutes(59);
            endDate.setSeconds(59)
            endDate.setYear($scope.formData.repYear);
            endDate.setMonth($scope.formData.repMonth); // The -1 is the only way i got it to work....
            endDate.setDate(0); // subtract 1 day from the 1st to get last day of previous month.
            $scope.formData.lastItemDate = endDate;
        };

        $scope.prepareAndShowReport = function() {

            if($scope.formData.reportType == 'monthly')
                updateDatesForMonthReport();


            var params = {
                customerid : $scope.formData.customerId,
                start: $scope.formData.firstItemDate,
                finish: $scope.formData.lastItemDate,
            };

            $state.go('tab.reports-bydate',params);
        };

        $scope.shouldShowCustomerList = function () {

            if($scope.formData.reportType == 'none')
                return false;

            if($scope.formData.firstItemDate && $scope.formData.lastItemDate)
                return true;
            else if ($scope.formData.repYear && $scope.formData.repMonth)
                return true;

            return false;
        };

    }]);
