'use strict';

/**
 * @ngdoc function
 * @name recnaleerfClientApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the recnaleerfClientApp
 */

angular.module('recnaleerfClientApp')
    .controller('customerDetailCtrl', function($scope, $stateParams, Customer, WorkItem, WorkItemSrv,$state,$ionicLoading) {

        Customer.getById($stateParams.customerid).then(function(customer) {
            $scope.customer = customer;

            updateTotalWorkHours();

        }, function(aError) {
            console.log(aError);
        });

        var updateDatesForMonthReport = function () {
            var startDate = new Date();
            startDate.setHours(0);
            startDate.setMinutes(0);
            startDate.setSeconds(1)
            startDate.setDate(1);
            $scope.firstItemDate = startDate;

            var endDate = new Date();
            endDate.setHours(23);
            endDate.setMinutes(59);
            endDate.setSeconds(59)
            endDate.setMonth(endDate.getMonth()+1); // The -1 is the only way i got it to work....
            endDate.setDate(0); // subtract 1 day from the 1st to get last day of previous month.
            $scope.lastItemDate = endDate;
        };

        var updateTotalWorkHours = function () {
            updateDatesForMonthReport();
            WorkItem.getByDateAndCustomer($scope.currentUser,$scope.customer,$scope.firstItemDate,$scope.lastItemDate).then(
                function(aworkItems) {
                    $scope.monthlyWorkHours = 0;
                    console.log('listing hours '+aworkItems.length);
                    var sum = 0;
                    for(var i=0;i<aworkItems.length;i++){
                        var x = aworkItems[i].elapsedTime();
                        sum += aworkItems[i].elapsedTime().getTime();
                    }

                    var hours = Math.floor(sum/(1000 * 60 * 60));
                    if(hours < 10) hours = '0' + hours;
                    var minutes = Math.floor((sum - (hours * 60 * 60 * 1000)) / (1000 * 60));
                    if(minutes < 10) minutes = '0' + minutes;
                    console.log('hours '+hours+' minutes '+minutes);
                    $scope.monthlyWorkHours = hours + ':' + minutes;


                }, function(aError) {
                    console.log(aError);
                }
            );
        };

        $scope.prepareNewWorkItem = function() {
            $scope.newWorkitem = new WorkItem();
            $scope.newWorkitem.start = new Date();
            $scope.newWorkitem.finish = new Date();
            $scope.newWorkitem.owner = $scope.currentUser;
            $scope.newWorkitem.customer = $scope.customer;
            $scope.newWorkitem.rate = $scope.customer.ratePerHour;
        };

        $scope.createWorkItem = function (workItem) {
            $ionicLoading.show();
            WorkItemSrv.createNew(workItem).then(
                function(newItem) {
                    $scope.newWorkitem = null;
                    updateTotalWorkHours();
                    navigator.notification.alert('Work item added',null,'Notice');
                    $ionicLoading.hide();
            },
                function(value) {
                    navigator.notification.alert('Failed to add work item',null,'Notice');
                    console.log(value.Error);
                    $ionicLoading.hide();
            });
        }

        $scope.editCustomer = function () {
            var params = {
                customerid : $scope.customer.id
            };

            $state.go('tab.customer-edit',params);
        }
    });