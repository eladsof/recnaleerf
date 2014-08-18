angular.module('recnaleerfClientApp').
    factory('WorkItem', function($q) {

        var WorkItem = Parse.Object.extend("WorkItem",
            {
                elapsedTime : function() {
                    return this.finish-this.start;
                },

                formattedElapsedTime : function() {
                    var elapsed = new Date(this.finish-this.start);
                    var hours = elapsed.getUTCHours(); if(hours < 10) hours =  '0' + hours;
                    var mins = elapsed.getUTCMinutes(); if(mins < 10) mins =  '0' + mins;
                    var secs = elapsed.getUTCSeconds(); if(secs < 10) secs =  '0' + secs;
                    return hours + ':' + mins + ':' + secs;
                }
            }
            ,
            { // Class methods
                listByCustomer : function(aUser,aCustomer) {
                    var defer = $q.defer();

                    var query = new Parse.Query(this);
                    query.equalTo("owner", aUser);
                    query.equalTo("customer", aCustomer);
                    query.find({
                        success : function(aWorkItems) {
                            defer.resolve(aWorkItems);
                        },
                        error : function(aError) {
                            defer.reject(aError);
                        }
                    });

                    return defer.promise;
                }
            }
        );

        // Properties
        Object.defineProperty(WorkItem.prototype, "owner", {
            get: function() {
                return this.get("owner");
            },
            set: function(aValue) {
                this.set("owner", aValue);
            }
        });

        Object.defineProperty(WorkItem.prototype, "customer", {
            get: function() {
                return this.get("customer");
            },
            set: function(aValue) {
                this.set("customer", aValue);
            }
        });

        Object.defineProperty(WorkItem.prototype, "start", {
            get: function() {
                console.log(this.get("start"));
                return this.get("start");
            },
            set: function(aValue) {
                this.set("start", aValue);
            }
        });

        Object.defineProperty(WorkItem.prototype, "finish", {
            get: function() {
                console.log(this.get("finish"));
                return this.get("finish");
            },
            set: function(aValue) {
                this.set("finish", aValue);
            }
        });

        Object.defineProperty(WorkItem.prototype, "isComplete", {
            get: function() {
                console.log(this.get("isComplete"));
                return this.get("isComplete");
            },
            set: function(aValue) {
                this.set("isComplete", aValue);
            }
        });

        Object.defineProperty(WorkItem.prototype, "rate", {
            get: function() {
                return this.get("rate");
            },
            set: function(aValue) {
                this.set("rate", aValue);
            }
        });

        Object.defineProperty(WorkItem.prototype, "comment", {
            get: function() {
                return this.get("comment");
            },
            set: function(aValue) {
                this.set("comment", aValue);
            }
        });

        return WorkItem;

    });