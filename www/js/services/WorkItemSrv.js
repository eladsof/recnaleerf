'use strict';

/**
 * @ngdoc function
 * @name recnaleerfClientApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the recnaleerfClientApp
 */
angular.module('recnaleerfClientApp')
    .service('WorkItemSrv', ['$rootScope', '$location', 'WorkItem', '$q' ,function ($scope,$location,WorkItem,$q) {



        this.createNew = function (aItem){

            var deferred;
            deferred = $q.defer();

            var item = new WorkItem();
            item.start = aItem.start;
            item.finish= aItem.finish;
            item.comment = aItem.comment;
            item.rate = aItem.rate;
            item.owner = aItem.owner;
            item.customer = aItem.customer;
            item.isComplete = true;

            item.save(null, {
                success: function (item) {
                    return deferred.resolve(item);
                },
                error: function (item, error) {
                    return deferred.reject({item: item, error: error});
                }
            });

            return deferred.promise;
        };

        this.remove = function (aItem) {
            aItem.destroy({
                success: function(customer) {
                    // The object was deleted from the Parse Cloud.
                },
                error: function(customer, error) {
                    // The delete failed.
                    // error is a Parse.Error with an error code and description.
                }});
        };

        this.update = function (aItem) {
            console.log('updated')
            this.create(aItem);
        };


    }]);

