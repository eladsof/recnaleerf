angular.module('recnaleerfClientApp').
    factory('MyUser', function() {

        var User = Parse.User.extend({
            // Add properties and methods}

        }, {
            // Class methods
        });

        // Properties
        Object.defineProperty(User.prototype, "username", {
            get: function() {
                return this.get("username");
            },
            set: function(aValue) {
                this.set("username", aValue);
            }
        });
        Object.defineProperty(User.prototype, "password", {
            get: function() {
                return this.get("password");
            },
            set: function(aValue) {
                this.set("password", aValue);
            }
        });
        Object.defineProperty(User.prototype, "email", {
            get: function() {
                return this.get("email");
            },
            set: function(aValue) {
                this.set("email", aValue);
            }
        });
        Object.defineProperty(User.prototype, "fullname", {
            get: function() {
                return this.get("fullname");
            },
            set: function(aValue) {
                this.set("fullname", aValue);
            }
        });
        Object.defineProperty(User.prototype, "address", {
            get: function() {
                return this.get("address");
            },
            set: function(aValue) {
                this.set("address", aValue);
            }
        });




        return User;
    });
