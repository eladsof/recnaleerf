angular.module('recnaleerfClientApp').
    factory('WorkItem', function($q) {

        var WorkItem = Parse.Object.extend("WorkItem",
            {
                elapsedTime : function() {
                    return new Date(this.finish-this.start);

                },
                formattedElapsedTime : function(includeSeconds) {
                    var elapsed = this.elapsedTime();
                    var result = "";

                    var hours = elapsed.getUTCHours();
                    if(isNaN(hours))
                        hours = '00';
                    else if(hours < 10)
                        hours =  '0' + hours;
                    result+=hours;

                    var mins = elapsed.getUTCMinutes();
                    if(isNaN(mins))
                        mins = '00';
                    if(mins < 10)
                        mins =  '0' + mins;
                    result+=':'+mins;

                    if(includeSeconds) {
                        var secs = elapsed.getUTCSeconds();
                        if(isNaN(secs))
                            secs = '00'
                        else if(secs < 10)
                            secs =  '0' + secs;
                        result+=':'+secs;
                    }
                    return result;
                },
                totalCharge : function(){
                    var time = new Date(this.elapsedTime());
                    var amount = time.getUTCHours()*this.rate;
                    var partOfHour = Math.ceil(time.getUTCMinutes() / 15) / 4;
                    amount += partOfHour * this.rate;
                    return amount;
                },
                roundedTotalCharge: function () {
                    return Math.floor(this.totalCharge());
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
                },
                getFirstItemDate : function(aUser,aCustomer) {
                    var defer = $q.defer();

                    var query = new Parse.Query(this);
                    query.equalTo("owner", aUser);
                    query.equalTo("customer", aCustomer);
                    query.ascending('finish');
                    query.first({
                        success : function(aDate) {
                            defer.resolve(aDate.finish);
                        },
                        error : function(aError) {
                            defer.reject(aError);
                        }
                    });

                    return defer.promise;
                },
                getLastItemDate : function(aUser,aCustomer) {
                    var defer = $q.defer();

                    var query = new Parse.Query(this);
                    query.equalTo("owner", aUser);
                    query.equalTo("customer", aCustomer);
                    query.descending('finish');
                    query.first({
                        success : function(aDate) {
                            console.log('getLastItemDate '+aDate);
                            defer.resolve(aDate.finish);
                        },
                        error : function(aError) {
                            defer.reject(aError);
                        }
                    });

                    return defer.promise;
                },
                getAllItemDates : function(aUser,aCustomer) {
                    var defer = $q.defer();
                    var query = new Parse.Query(this);
                    query.equalTo("owner", aUser);
                    query.equalTo("customer", aCustomer);
                    query.select('finish');
                    query.ascending('finish');
                    query.limit(1000);
                    query.find({
                        success : function(aItemDates) {
                            defer.resolve(aItemDates);
                        },
                        error : function(aError) {
                            defer.reject(aError);
                        }
                    });

                    return defer.promise;
                },
                getByDateAndCustomer: function(aUser,aCustomer,aStart,aFinish) {
                    var defer = $q.defer();
                    var query = new Parse.Query(this);
                    query.equalTo("owner", aUser);
                    query.include("customer");

                    if(aCustomer)
                        query.equalTo("customer", aCustomer);
                    if(aStart)
                        query.greaterThanOrEqualTo('start',aStart);
                    if(aFinish)
                        query.lessThanOrEqualTo('finish',aFinish);

                    query.ascending('finish');
                    query.limit(1000);

                    query.find({
                        success : function(aItems) {
                            defer.resolve(aItems);
                        },
                        error : function(aError) {
                            defer.reject(aError);
                        }
                    });

                    return defer.promise;
                },
                getLastItem : function(aUser) {
                    var defer = $q.defer();

                    var query = new Parse.Query(this);
                    query.equalTo("owner", aUser);
                    query.descending('start');
                    query.include('owner');
                    query.include('customer');
                    query.first({
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
                return this.get("start");
            },
            set: function(aValue) {
                this.set("start", aValue);
            }
        });
        Object.defineProperty(WorkItem.prototype, "finish", {
            get: function() {
                return this.get("finish");
            },
            set: function(aValue) {
                this.set("finish", aValue);
            }
        });
        Object.defineProperty(WorkItem.prototype, "isComplete", {
            get: function() {
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
        Object.defineProperty(WorkItem.prototype, "startedByLocation", {
            get: function() {
                return this.get("startedByLocation");
            },
            set: function(aValue) {
                this.set("startedByLocation", aValue);
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