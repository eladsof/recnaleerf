angular.module('recnaleerfClientApp')
    .service('GlobalSrv', ['$rootScope', 'Geolocation', 'Customer','$interval','WorkItem','$ionicLoading','$translate' ,
    function ($rootScope,Geolocation,Customer,$interval,WorkItem,$ionicLoading,$translate) {

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
            $rootScope.distanceFromCustomer1 = 1000000000;
						
            for(var i=0;i<$rootScope.customers.length;i++){
                if(new Date() >= $rootScope.customers[i].ignoreUntil) {
                    if($rootScope.customers[i].address) {

                        var customerLocation = new google.maps.LatLng($rootScope.customers[i].address.geometry.location.k, $rootScope.customers[i].address.geometry.location.B);

                        // All of this is temporary for debugging purposes.
                        var dist = Geolocation.distanceFromCustomer($rootScope.currentLocation,customerLocation);
                        console.log(" ===== Dist between " + $rootScope.currentLocation + " and "  + customerLocation + "is : "+dist+" ==========");

                        if(dist < $rootScope.distanceFromCustomer1){
                            $rootScope.distanceFromCustomer1 = dist;
                            $rootScope.nearestCustomer1 = $rootScope.customers[i].name;
                        }
                        // ================== END OF DEBUGGING ====================

                        if (Geolocation.isCloseToCustomer($rootScope.currentLocation,customerLocation))
                            arrivingAtCustomer($rootScope.customers[i]);
                        else
                            console.log('not close enough to <> : ' + $rootScope.customers[i].name + ' object is ' + $rootScope.customers[i].address.geometry.location.k + '+' + $rootScope.customers[i].address.geometry.location.B);
                    }
                }
                else
                {
                    console.log('Ignoring customer '+$rootScope.customers[i].name+ ' because '+$rootScope.customers[i].ignoreUntil+' is smaller than '+new  Date());
                }
            }
        };
        var arrivingAtCustomer = function(customer) {
            stopTimer();
            var msg = $translate.instant('Q_START_WORK_FOR') + ':\r\n' + customer.name ;
            navigator.notification.confirm( msg,
                                            function(buttonIndex){
                                                arrivingAtCustomerConfirmed(buttonIndex, customer);
                                            },
                                            $translate.instant('CUSTOMER_LOCATED'),
                                            [$translate.instant('YES'),$translate.instant('SNOOZE'),$translate.instant('IGNORE_FOR_1_HOUR')]);
        };

        var arrivingAtCustomerConfirmed = function(buttonIndex,customer) {
            if (buttonIndex == 1) {
                $rootScope.startNewWorkItem(customer,true);
            } else {

                if (buttonIndex == 3) {
                    customer.ignoreUntil = new Date();
                    customer.ignoreUntil.setHours(customer.ignoreUntil.getHours()+1);
                }
                updateTimer(30);
            }
        };

        var checkIfLeavingCustomer = function() {
            var customerLocation = new google.maps.LatLng($rootScope.currentWorkItem.customer.address.geometry.location.k,
                $rootScope.currentWorkItem.customer.address.geometry.location.B);

            if(Geolocation.isFarFromCustomer($rootScope.currentLocation,customerLocation)) {
            		var msg = $translate.instant('Q_CLOSE_WORK_FOR') + ':\r\n' + $rootScope.currentWorkItem.customer.name;
                var startWorkItem = confirm(msg);
                if (startWorkItem) {
                    $rootScope.finishCurrentWorkItem();

                }

            }
        };
        var periodicUpdate = function() {
            if($rootScope.currentUser) {
                Geolocation.getLocation().then(function (coords) {
                        console.log('checking...')
                        $rootScope.currentLocation = new google.maps.LatLng(coords.latitude, coords.longitude);
                        if ($rootScope.currentWorkItem) {
                            updateCurrentWorkItem();
                        } else {
                            checkForNewWorkItem();
                        }
                    },
                    function(error) {
                        console.log('checking... '+error);
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
            console.log(' Time so far :' + $rootScope.currentWorkItem.formattedElapsedTime(true));
            if($rootScope.currentWorkItem.startedByLocation)
                checkIfLeavingCustomer();
        };
        var stopTimer = function () {

            if (angular.isDefined(stop)) {
                //alert('stopping timer');
                $interval.cancel(stop);
                stop = undefined;
            }
        };
        var updateTimer = function (secs) {
            stopTimer();
            stop = $interval(periodicUpdate, secs * 1000);
            //alert('timer updated ' + secs);
        };
        $rootScope.startNewWorkItem = function(customer,startedByLocation){
            if(customer == null)
                return;

            updateTimer(1);
            $rootScope.currentWorkItem = new WorkItem();
            $rootScope.currentWorkItem.customer = customer;
            $rootScope.currentWorkItem.start = new Date();
            $rootScope.currentWorkItem.isComplete = false;
            $rootScope.currentWorkItem.owner = $rootScope.currentUser;
            $rootScope.currentWorkItem.rate = customer.ratePerHour;
            $rootScope.currentWorkItem.startedByLocation = startedByLocation;
            $rootScope.currentWorkItem.save();
        };

        $rootScope.finishCurrentWorkItem = function () {
            updateTimer(idleTimerInterval);
            $rootScope.currentWorkItem.end = new Date();
            $rootScope.currentWorkItem.isComplete = true;
            $rootScope.currentWorkItem.save(null, {
                success: function(item) {
                    // Execute any logic that should take place after the object is saved.
                    var msg = $translate.instant('WORK_ITEM') + ' ' + $translate.instant('SAVED_SUCCESSFULLY') + '\r\n' + $translate.instant('CUSTOMER') + ' :'+ item.customer.name ;
                    navigator.notification.alert(msg,null,$translate.instant('SAVED_SUCCESSFULLY'));
                },
                error: function(customer, error) {
                    // Execute any logic that should take place if the save fails.
                    // error is a Parse.Error with an error code and description.
                    var msg = $translate.instant('WORK_ITEM NOT_CREATED') +  '\r\n' +$translate.instant('ERROR') + ':' + customer.name ;
                    navigator.notification.alert(msg,null,$translate.instant('ERROR'));
                }
            });
            $rootScope.currentWorkItem = null;
        };

        this.initialize = function () {
            $rootScope.$watch('currentUser', function(newValue, oldValue) {
                $rootScope.loadCustomerList();
            });
            updateTimer(idleTimerInterval);
        };

    }]);