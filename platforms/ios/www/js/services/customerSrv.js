'use strict';

/**
 * @ngdoc function
 * @name recnaleerfClientApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the recnaleerfClientApp
 */
angular.module('recnaleerfClientApp')
    .service('CustomerSrv', ['$rootScope', '$location', 'Customer','$state',function ($scope,$location,Customer,$state) {

        console.log('init customerSrv');

        this.createNew = function (aCustomer){
            var newCustomer = new Customer();
            newCustomer.name = aCustomer.name;
            newCustomer.ratePerHour = aCustomer.ratePerHour;
            newCustomer.owner = $scope.currentUser;
            newCustomer.address = aCustomer.address;

            newCustomer.save(null, {
                success: function(customer) {
                    // Execute any logic that should take place after the object is saved.
                    alert('Customer '+customer.name+' created succesfully');
                    $state.go('tab.customers');

                },
                error: function(customer, error) {
                    // Execute any logic that should take place if the save fails.
                    // error is a Parse.Error with an error code and description.
                    alert('Failed to create new customer, : ' + error.message);
                }
            });
        };

        this.remove = function (customer) {
            customer.destroy({
                success: function(customer) {
                    // The object was deleted from the Parse Cloud.
                },
                error: function(customer, error) {
                    // The delete failed.
                    // error is a Parse.Error with an error code and description.
                }});
        };

        this.update = function (customer) {
            this.create(customer);
        };

    }]);

