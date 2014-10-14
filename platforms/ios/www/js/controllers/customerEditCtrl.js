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
        .controller('customerEditCtrl', ['$scope', 'CustomerSrv', 'Customer','$stateParams', function ($scope,customerSrv,Customer,$stateParams) {

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
            console.log('Saving customer');
            var ret =  customerSrv.update(customer);
            return ret;
        };

        $scope.getPageTitle = function () {
            return 'EDIT_CUSTOMER_TITLE';
        }

        $scope.getButtonTxt = function () {
            return 'EDIT_CUSTOMER_BTN';
        };




    }]);
