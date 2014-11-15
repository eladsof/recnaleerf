angular.module('geoLocationModule',[])
    .service("Geolocation", [
        '$q', '$window', function($q, $window) {

            this.distanceFromCustomer = function(myLocation,customerLocation){
                return google.maps.geometry.spherical.computeDistanceBetween(myLocation, customerLocation);
            };

            this.isCloseToCustomer = function(myLocation,customerLocation){
                var distancee = this.distanceFromCustomer(myLocation, customerLocation);
                if(distancee < 500)
                    return true;
                else
                    return false;
            };

            this.isFarFromCustomer = function(myLocation,customerLocation){
                console.log('isFarFromCustomer');
                return !this.isCloseToCustomer(myLocation, customerLocation);
            };

            this.calcuateDistance = function (aAddress) {
                var deferred;
                deferred = $q.defer();

                this.getLocation().then(function (coords) {
                    var latlng = new google.maps.LatLng(coords.latitude, coords.longitude);
                    var distance = google.maps.geometry.spherical.computeDistanceBetween(latlng, aAddress.geometry.location);
                    return deferred.resolve(distance);
                });
                return deferred.promise;
            };



            this.getLocation = function() {
                var deferred;
                deferred = $q.defer();
                if (navigator && navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                            return deferred.resolve(position.coords);
                        }, function(error) {
                            return deferred.reject("Unable to get your location" + error.message);
                        },
                        { maximumAge: 3000, timeout: 3000, enableHighAccuracy: true });
                } else {

                    deferred.reject("Your browser cannot access to your position");
                }
                return deferred.promise;
            };

            this.getAddress = function() {
                var deferred,
                    _this = this;
                this.geocoder || (this.geocoder = new google.maps.Geocoder());
                deferred = $q.defer();
                this.getLocation().then(function(coords) {
                    var latlng;
                    latlng = new google.maps.LatLng(coords.latitude, coords.longitude);
                    return _this.geocoder.geocode({
                        latLng: latlng
                    }, function(results, status) {
                        if (status === google.maps.GeocoderStatus.OK) {
                            return deferred.resolve(_this.extractAddress(results));
                        } else {
                            return deferred.reject("cannot geocode status: " + status);
                        }
                    }, function() {
                        return deferred.reject("cannot geocode");
                    });
                });
                return deferred.promise;
            };

            this.extractAddress = function(addresses) {
                var address, component, result, _i, _j, _len, _len1, _ref;
                result = {};
                for (_i = 0, _len = addresses.length; _i < _len; _i++) {
                    address = addresses[_i];
                    result.fullAddress || (result.fullAddress = address.formatted_address);
                    result.coord || (result.coord = [address.geometry.location.ob, address.geometry.location.pb]);
                    _ref = address.address_components;
                    for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                        component = _ref[_j];
                        if (component.types[0] === "route") {
                            result.street || (result.street = component.long_name);
                        }
                        if (component.types[0] === "locality") {
                            result.city || (result.city = component.long_name);
                        }
                        if (component.types[0] === "postal_code") {
                            result.zip || (result.zip = component.long_name);
                        }
                        if (component.types[0] === "country") {
                            result.country || (result.country = component.long_name);
                        }
                    }
                }
                return result;
            };

            return this;
        }
    ]);