'use strict';

/**
 * @ngdoc function
 * @name recnaleerfClientApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the recnaleerfClientApp
 */

angular.module('recnaleerfClientApp')
    .controller('customerDetailCtrl', function($scope, $stateParams, Customer, WorkItem, WorkItemSrv) {

        Customer.getById($stateParams.customerid).then(function(customer) {
            $scope.customer = customer;

            updateTotalWorkHours();

        }, function(aError) {
            console.log(aError);
        });

        var updateTotalWorkHours = function () {
            WorkItem.listByCustomer($scope.currentUser,$scope.customer).then(function(aworkItems) {
                $scope.monthlyWorkHours = 0;
                console.log('listing hours '+aworkItems.length);
                var sum = 0;
                for(var i=0;i<aworkItems.length;i++){
                    var x = aworkItems[i].elapsedTime();
                    console.log(i+':'+x);
                    console.log(aworkItems[i].formattedElapsedTime());
                    sum += aworkItems[i].elapsedTime().getTime();
                }
                console.log('SUM --------- '+sum+ '--------------');
                var hours = Math.floor(sum/(1000 * 60 * 60));
                if(hours < 10) hours = '0' + hours;
                var minutes = Math.floor((sum - (hours * 60 * 60 * 1000)) / (1000 * 60));
                if(minutes < 10) minutes = '0' + minutes;
                console.log('hours '+hours+' minutes '+minutes);
                $scope.monthlyWorkHours = hours + ':' + minutes;


            }, function(aError) {
                console.log(aError);
            });
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
                    alert('Work item logged');
                    $ionicLoading.hide();
            },
                function(value) {
                    alert('Failed to add work item');
                    console.log(value.Error);
                    $ionicLoading.hide();
            });
        }
    });