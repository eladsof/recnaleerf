'use strict';

/**
 * @ngdoc function
 * @name recnaleerfClientApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the recnaleerfClientApp
 */
angular.module('recnaleerfClientApp')
    .service('CustomerSrv', ['$rootScope', '$location', 'Customer' ,function ($scope,$location,Customer) {

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
                    alert('New customer '+customer.name+' created objectId: ' + customer.id);
                },
                error: function(customer, error) {
                    // Execute any logic that should take place if the save fails.
                    // error is a Parse.Error with an error code and description.
                    alert('Failed to create new object, with error code: ' + error.message);
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

