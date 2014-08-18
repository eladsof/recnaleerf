angular.module('recnaleerfClientApp').
    factory('Customer', function($q) {

        var Customer = Parse.Object.extend("Customer",
            {
            // Instance methods
            }
            ,
            { // Class methods
                listByUser : function(aUser) {
                    var defer = $q.defer();

                    var query = new Parse.Query(this);
                    query.equalTo("owner", aUser);
                    query.find({
                        success : function(aCustomers) {
                            defer.resolve(aCustomers);
                        },
                        error : function(aError) {
                            defer.reject(aError);
                        }
                    });

                    return defer.promise;
                },

                getById : function(id) {
                    var defer = $q.defer();

                    var query = new Parse.Query(this);
                    query.get(id, {
                        success: function(customer) {
                            defer.resolve(customer);
                        },
                        error: function(object, error) {
                            defer.reject(aError);
                        }
                    });
                    return defer.promise;
                },
            }
        );

    // Properties
    Object.defineProperty(Customer.prototype, "owner", {
        get: function() {
            return this.get("owner");
        },
        set: function(aValue) {
            this.set("owner", aValue);
        }
    });

    Object.defineProperty(Customer.prototype, "name", {
        get: function() {
            return this.get("name");
        },
        set: function(aValue) {
            this.set("name", aValue);
        }
    });

    Object.defineProperty(Customer.prototype, "ratePerHour", {
        get: function() {
            return this.get("ratePerHour");
        },
        set: function(aValue) {
            this.set("ratePerHour", aValue);
        }
    });

    Object.defineProperty(Customer.prototype, "address", {
        get: function() {
            return this.get("address");
        },
        set: function(aValue) {
            this.set("address", aValue);
        }
    });

    return Customer;

});