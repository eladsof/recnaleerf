'use strict';

/**
 * @ngdoc function
 * @name recnaleerfClientApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the recnaleerfClientApp
 */
angular.module('recnaleerfClientApp')
    .service('CustomerSrv', ['$rootScope', '$location', 'Customer','$state',function ($rootScope,$location,Customer,$state) {

        console.log('init customerSrv');

        this.createNew = function (aCustomer){
            var newCustomer = new Customer();
            newCustomer.name = aCustomer.name;
            newCustomer.ratePerHour = aCustomer.ratePerHour;
            newCustomer.owner = $rootScope.currentUser;
            newCustomer.address = aCustomer.address;
            newCustomer.deleted = false;

            newCustomer.save(null, {
                success: function(customer) {
                    // Execute any logic that should take place after the object is saved.
                    navigator.notification.alert('Customer '+customer.name+' created succesfully',null,'Notice');
                    $rootScope.loadCustomerList();
                    $state.go('tab.customers');


                },
                error: function(customer, error) {
                    // Execute any logic that should take place if the save fails.
                    // error is a Parse.Error with an error code and description.
                    navigator.notification.alert('Failed to create '+customer.name+' - ' + + error.message,null,'Notice');
                }
            });
        };

        this.delete = function (customer) {
            customer.deleted = true;
            customer.save(null,{
                success: function(customer) {
                    $rootScope.loadCustomerList();
                },
                error: function(customer, error) {
                    // The delete failed.
                    // error is a Parse.Error with an error code and description.
                }});
        };

        this.update = function (customer) {
            customer.save();
        };

    }]);

