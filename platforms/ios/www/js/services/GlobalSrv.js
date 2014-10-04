angular.module('recnaleerfClientApp')
    .service('GlobalSrv', ['$rootScope', 'Geolocation', 'Customer','$interval','WorkItem','$ionicLoading' ,function ($rootScope,Geolocation,Customer,$interval,WorkItem,$ionicLoading) {

        var stop = undefined;
        var idleTimerInterval = 5;

        $rootScope.loadCustomerList = function () {
            if($rootScope.currentUser){
                $ionicLoading.show();
                console.log('Loading new custoemr list');
                $rootScope.customers = Customer.listByUser($rootScope.currentUser).then(function(aCustomers) {
                    $rootScope.customers = aCustomers;
                    for(var i=0;i<$rootScope.customers.length;i++)
                        $rootScope.customers[i].ignoreUntil = new Date();
                    $ionicLoading.hide();
                }, function(aError) {
                    console.log(aError);
                });
            }
        };
        var checkForCustomerProximity = function() {

            for(var i=0;i<$rootScope.customers.length;i++){
                if(new Date() >= $rootScope.customers[i].ignoreUntil) {
                    if($rootScope.customers[i].address)
                        if(Geolocation.isCloseToCustomer($rootScope.currentLocation,$rootScope.customers[i].address.geometry.location))
                            arrivingAtCustomer($rootScope.customers[i]);
                        else
                            console.log('not close enough to : ' + $rootScope.customers[i].name);
                }
                else
                {
                    console.log('Ignoring customer '+$rootScope.customers[i].name+ ' because '+$rootScope.customers[i].ignoreUntil+' is smaller than '+new  Date());
                }
            }
        };
        var arrivingAtCustomer = function(customer) {
            stopTimer();
            var startWorkItem = confirm('Do you want to start a new work item for ' + customer.name + ' ?');
            if (startWorkItem) {
                $rootScope.startNewWorkItem(customer);
            } else {
                var ignoreCustomerForHour = confirm('Ignore ' + customer.name + ' for one hour?');
                if (ignoreCustomerForHour) {
                    customer.ignoreUntil = new Date();
                    customer.ignoreUntil.setHours(customer.ignoreUntil.getHours()+1);
                }
                updateTimer(30);
            }
        };
        var checkIfLeavingCustomer = function() {
            if(Geolocation.isFarFromCustomer($rootScope.currentLocation,$rootScope.currentWorkItem.customer.address.geometry.location)) {
                //Close current work Item.
                return;
            }
        };
        var periodicUpdate = function() {
            console.log('periodicUpdate...')
            if($rootScope.currentUser) {
                console.log('periodicUpdate - yes...')
                Geolocation.getLocation().then(function (coords) {
                    console.log('checking...')
                    $rootScope.currentLocation = new google.maps.LatLng(coords.latitude, coords.longitude);
                    if ($rootScope.currentWorkItem) {
                        updateCurrentWorkItem();
                    } else {
                        checkForNewWorkItem();
                    }
                });
            }
        };
        var checkForNewWorkItem = function () {
            checkForCustomerProximity();
        };
        var updateCurrentWorkItem = function () {
            $rootScope.currentWorkItem.finish = new Date();
            checkIfLeavingCustomer();
        };
        var stopTimer = function () {
            if (angular.isDefined(stop)) {
                $interval.cancel(stop);
                stop = undefined;
            }
        };
        var updateTimer = function (secs) {
            stopTimer();
            stop = $interval(periodicUpdate, secs * 1000);
        };
        $rootScope.startNewWorkItem = function(customer){
            if(customer == null)
                return;

            updateTimer(1);
            $rootScope.currentWorkItem = new WorkItem();
            $rootScope.currentWorkItem.customer =customer;
            $rootScope.currentWorkItem.start = new Date();
            $rootScope.currentWorkItem.isComplete = false;
            //$rootScope.currentWorkItem.save();
        };
        $rootScope.finishCurrentWorkItem = function () {
            updateTimer(idleTimerInterval);
            $rootScope.currentWorkItem.end = new Date();
            $rootScope.currentWorkItem.isComplete = true;
            //    $rootScope.currentWorkItem.save(null, {
            //     success: function(item) {
            //     // Execute any logic that should take place after the object is saved.
            //     alert('New item created objectId: ' + item.id);
            //     },
            //     error: function(customer, error) {
            //     // Execute any logic that should take place if the save fails.
            //     // error is a Parse.Error with an error code and description.
            //     alert('Failed to create new object, with error code: ' + error.message);
            //     }
            //     });
            $rootScope.currentWorkItem = null;
        };

        this.initialize = function () {
            $rootScope.$watch('currentUser', function(newValue, oldValue) {
                $rootScope.loadCustomerList();
            });
            updateTimer(idleTimerInterval);
        };

    }]);