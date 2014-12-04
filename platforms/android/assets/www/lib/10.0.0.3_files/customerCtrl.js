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

        var refreshCustomers  = function() {
            $scope.loadCustomerList();
        };

        $scope.CreateCustomer = function () {
            $scope.editedCustomer = new Customer();
            $state.go('tab.customer-new');
        }

        $scope.createNew = function(customer) {
            var ret =  customerSrv.createNew(customer);
            return ret;
        };

        $scope.deleteCustomer = function(customer) {

            var ret = confirm(' Are you sure you want to delete '+customer.name+' \r\n This action is irriversible');
            if(ret)
                customerSrv.delete(customer);
        };

        $scope.getPageTitle = function () {
            return 'CREATE_CUSTOMER_TITLE';
        };

        $scope.getButtonTxt = function () {
            return 'CREATE_CUSTOMER_BTN';
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

        refreshCustomers();


    }]);
