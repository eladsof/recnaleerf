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
    .controller('customerCtrl', ['$scope','$rootScope','$location', 'CustomerSrv', 'Customer', 'Geolocation','$state','$ionicLoading', '$translate', function ($scope,$rootScope,$location,customerSrv,Customer,Geolocation,$state,$ionicLoading,$translate) {

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
            $ionicLoading.show();
            customerSrv.createNew(customer).then(
                function(customer) {
                    var msg = customer.name + ' ' + $translate.instant('SAVED_SUCCESSFULLY');
                    console.log('Customer '+customer.name+' created succesfully');
                    navigator.notification.alert(msg,null,$translate.instant('SAVED_SUCCESSFULLY'));
                    $rootScope.loadCustomerList();
                    $state.go('tab.customers');
                    $ionicLoading.hide();
                },
                function(customer,error) {
                    var msg = $translate.instant('CUSTOMER') + ' ' + $translate.instant('CUSTOMER') + ' : ' + error.message;
                    console.log('Failed to create '+customer.name+' - ' + + error.message);
                    navigator.notification.alert(msg,null,$translate.instant('ERROR'));
                    $ionicLoading.hide();
                }
            );
        };

        $scope.getPageTitle = function () {
            return 'CREATE_CUSTOMER_TITLE';
        };

        $scope.getButtonTxt = function () {
            return 'CREATE_CUSTOMER_BTN';
        };

        $scope.deleteCustomer = function(customer) {
            var msg = $translate.instant('ABOUT_TO_DELETE') + ' ' + customer.name + ' \r\n' + $translate.instant('THIS_ACTION_IS_IRREVERSIBLE');
            navigator.notification.confirm( msg,
                function(buttonIndex){
                    if(buttonIndex == 1)
                        customerSrv.delete(customer);
                },
                $translate.instant('PROCEED'),
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
