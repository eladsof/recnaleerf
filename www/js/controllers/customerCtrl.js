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
    .controller('customerCtrl', ['$scope','$location', 'CustomerSrv', 'Customer', 'Geolocation','$state', function ($scope,$location,customerSrv,Customer,Geolocation,$state) {

        // This methods overcomes a UI problem with google and autocomplete
        angular.element(window.document).bind('DOMNodeInserted', function(e) {
            var element = angular.element(e.target);
            if(document.querySelectorAll('.pac-container'))
                for(var i=0; i < document.querySelectorAll('.pac-container').length; i++)
                    document.querySelectorAll('.pac-container')[i].setAttribute('data-tap-disabled', 'true');

            if(element.hasClass('pac-item')){
                element.addClass('needsclick');
            }
        });

        $scope.editedCustomer;

        //var refreshCustomers  = function() {
        //    $scope.loadCustomerList();
        //};

        $scope.CreateCustomer = function () {
            $scope.editedCustomer = new Customer();
            $state.go('tab.customer-new');
        };

        $scope.cancelCreateAction = function () {
            $state.go('tab.customers');
        };

        $scope.saveCustomer = function(customer) {
            var ret =  customerSrv.createNew(customer);
            return ret;
        };

        $scope.getPageTitle = function () {
            return 'CREATE_CUSTOMER_TITLE';
        };

        $scope.getButtonTxt = function () {
            return 'CREATE_CUSTOMER_BTN';
        };

        $scope.deleteCustomer = function(customer) {
            var msg = 'You want to delete '+customer.name+' \r\n This action is irriversible';
            navigator.notification.confirm( msg,
                function(buttonIndex){
                    if(buttonIndex == 1)
                        customerSrv.delete(customer);
                },
                'Are you sure?',
                ['Yes','No']);
        };

        $scope.calc = function(){
             Geolocation.calcuateDistance($scope.customer.address).then(function (distance) { $scope.dist = distance});
        };

        $scope.onSwipeLeft = function (customer) {
            customer.shouldShowDelete = true;
        };
        $scope.onSwipeRight = function (customer) {
            customer.shouldShowDelete = false;
        };

        $scope.getCustomers =function(){
            return $rootScope.customers;
        };

        //refreshCustomers();


    }]);
