angular.module('recnaleerfClientApp').
    factory('MyUser', function() {

        var User = Parse.User.extend({

            // Add properties and methods}

        }, {
            // Class methods
        });

        return User;
    });
