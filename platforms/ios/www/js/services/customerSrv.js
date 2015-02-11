'use strict';

/**
 * @ngdoc function
 * @name recnaleerfClientApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the recnaleerfClientApp
 */
angular.module('recnaleerfClientApp')
    .service('CustomerSrv', ['$rootScope', '$location', 'Customer','$q',function ($rootScope,$location,Customer,$q) {

        console.log('init customerSrv');

        this.createNew = function (aCustomer) {
            var deferred;
            deferred = $q.defer();

            var newCustomer = new Customer();
            newCustomer.name = aCustomer.name;
            newCustomer.ratePerHour = Number(aCustomer.ratePerHour);
            newCustomer.owner = $rootScope.currentUser;
            newCustomer.address = aCustomer.address;
            newCustomer.deleted = false;

            newCustomer.save(null, {
                success: function(customer) { return deferred.resolve(customer); },
                error:   function(customer,error) {return deferred.reject({customer: customer,error: error});}
            });

            return deferred.promise;
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
            var deferred;
            deferred = $q.defer();

            customer.save(null, {
                success: function(customer) { return deferred.resolve(customer); },
                error:   function(customer,error) {return deferred.reject({customer: customer,error: error});}
            });

            return deferred.promise;
        };

    }]);

