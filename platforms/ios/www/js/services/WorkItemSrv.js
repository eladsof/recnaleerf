'use strict';

/**
 * @ngdoc function
 * @name recnaleerfClientApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the recnaleerfClientApp
 */
angular.module('recnaleerfClientApp')
    .service('WorkItemSrv', ['$rootScope', '$location', 'WorkItem' ,function ($scope,$location,WorkItem) {



        this.createNew = function (aItem){
            console.log('This is the comment '+aItem.comment);
            var item = new WorkItem();
            item.start = aItem.start;
            item.finish= aItem.finish;
            item.comment = aItem.comment;
            item.rate = aItem.rate;
            item.owner = aItem.owner;
            item.customer = aItem.customer;
            item.isComplete = true;

            item.save(null, {
                success: function(item) {
                    // Execute any logic that should take place after the object is saved.
                    alert('New item created objectId: ' + item.id);
                },
                error: function(customer, error) {
                    // Execute any logic that should take place if the save fails.
                    // error is a Parse.Error with an error code and description.
                    alert('Failed to create new object, with error code: ' + error.message);
                }
            });
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
            this.create(aItem);
        };


    }]);

