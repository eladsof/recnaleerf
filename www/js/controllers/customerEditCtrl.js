'use strict';

/**
 * @ngdoc function
 * @name recnaleerfClientApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the recnaleerfClientApp
 */

angular.module('recnaleerfClientApp')
        .controller('customerEditCtrl', ['$scope','$rootScope', 'CustomerSrv', 'Customer','$stateParams','$ionicLoading','$translate', function ($scope,$rootScope,customerSrv,Customer,$stateParams,$ionicLoading,$translate) {

        console.log("Editing "+$stateParams.customerid);
        Customer.getById($stateParams.customerid).then(function(customer) {
            $scope.editedCustomer = customer;
            $scope.address = customer.address.formatted_address;
        }, function(aError) {
            console.log(aError);
        });
        console.log($scope.editedCustomer);

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

        $scope.saveCustomer = function(customer) {
            $ionicLoading.show();
            customerSrv.update(customer).then(
                function(customer) {
                    var msg = customer.name + ' ' + $translate.instant('SAVED_SUCCESSFULLY');
                    console.log('Customer '+customer.name+' updated succesfully');
                    navigator.notification.alert(msg,null,$translate.instant('SAVED_SUCCESSFULLY'));
                    $rootScope.loadCustomerList();
                    $ionicLoading.hide();
                },
                function(customer,error) {
                    var msg = $translate.instant('CUSTOMER') + ' ' + $translate.instant('CUSTOMER') + ' : ' + error.message;
                    console.log('Failed to update '+customer.name+' - ' + + error.message);
                    navigator.notification.alert(msg,null,$translate.instant('ERROR'));
                    $ionicLoading.hide();
                }
            );
        };

        $scope.getPageTitle = function () {
            return 'EDIT_CUSTOMER_TITLE';
        }

        $scope.getButtonTxt = function () {
            return 'EDIT_CUSTOMER_BTN';
        };




    }]);
