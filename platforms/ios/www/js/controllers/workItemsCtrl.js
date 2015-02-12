'use strict';

/**
 * @ngdoc function
 * @name recnaleerfClientApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the recnaleerfClientApp
 */

angular.module('recnaleerfClientApp')
    .controller('workItemsCtrl', ['$scope','$location', 'Customer', 'WorkItem', 'WorkItemSrv' ,
        function ($scope,$location,Customer,WorkItem,WorkItemSrv) {

        $scope.testDate = new Date($.now());

        console.log("init customerCtrl");
        $scope.currentCustomer = null;
        $scope.customerSelected = false;

        $scope.customerChanged = function() {
            console.log('customer has changed and is now no other than : ' + $scope.currentCustomer.name);
            $scope.customerSelected = true;
            refreshWorkItems();
        };

        $scope.createNew = function(newItem) {
            newItem.customer = $scope.currentCustomer;
            newItem.owner = $scope.currentUser;
            var ret =  WorkItemSrv.createNew(newItem);
            refreshWorkItems();
            return ret;
        };


        var refreshCustomers  = function() {
            $ionicLoading.show();
            Customer.listByUser($scope.currentUser).then(function(aCustomers) {
                $scope.customers = aCustomers;
                $ionicLoading.hide();
            }, function(aError) {
                console.log(aError);
                $ionicLoading.hide();
            });
        };

        var refreshWorkItems = function(){
            $ionicLoading.show();
            WorkItem.listByCustomer($scope.currentUser,$scope.currentCustomer).then(function(aworkItems) {
                $scope.workItems = aworkItems;
                $ionicLoading.hide();
            }, function(aError) {
                console.log(aError);
                $ionicLoading.hide();
            });

            $scope.newWorkitem = new WorkItem();
            $scope.newWorkitem.rate = $scope.currentCustomer ? $scope.currentCustomer.ratePerHour : '';
            $scope.newWorkitem.start = new Date($.now());
            $scope.newWorkitem.finish = new Date($.now());
            console.log($scope.newWorkitem.finishStr);
        };

        var getNowStr = function(){
                var now = new Date($.now())
                    , year
                    , month
                    , date
                    , hours
                    , minutes
                    , seconds
                    , formattedDateTime
                    ;

                year = now.getFullYear();
                month = now.getMonth().toString().length === 1 ? '0' + (now.getMonth() + 1).toString() : now.getMonth() + 1;
                date = now.getDate().toString().length === 1 ? '0' + (now.getDate()).toString() : now.getDate();
                hours = now.getHours().toString().length === 1 ? '0' + now.getHours().toString() : now.getHours();
                minutes = now.getMinutes().toString().length === 1 ? '0' + now.getMinutes().toString() : now.getMinutes();
                seconds = now.getSeconds().toString().length === 1 ? '0' + now.getSeconds().toString() : now.getSeconds();

                formattedDateTime = year + '-' + month + '-' + date + 'T' + hours + ':' + minutes + ':' + seconds;
                return formattedDateTime;

            };

        refreshCustomers();
        refreshWorkItems();

    }]);
