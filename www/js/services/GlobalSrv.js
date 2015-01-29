angular.module('recnaleerfClientApp')
    .service('GlobalSrv', ['$rootScope', 'Geolocation', 'Customer','$interval','WorkItem','$ionicLoading','$translate' ,
    function ($rootScope,Geolocation,Customer,$interval,WorkItem,$ionicLoading,$translate) {

        var stop = undefined;
        var idleTimerInterval = 5;
        var bgGeo;

        $rootScope.currentLocation = null;
        $rootScope.distanceFromCustomer1 = null;
        $rootScope.nearestCustomer1 = null;

        var x = "Moshe";

        $rootScope.loadCustomerList = function () {
            if($rootScope.currentUser){
                var ThisClass = this;
                $ionicLoading.show();
                Customer.listByUser($rootScope.currentUser).then(function(aCustomers) {
                    $rootScope.customers = aCustomers;
                    for(var i=0;i<$rootScope.customers.length;i++)
                        $rootScope.customers[i].ignoreUntil = new Date();
                    $ionicLoading.hide();
                    console.log("============= Customer list updated =============== ");
                }, function(aError) {
                    console.log(aError);
                }).then(initBgGeo) ;
            }
        };

        var checkForCustomerProximity = function() {
            for(var i=0;i<$rootScope.customers.length;i++){
                if(new Date() >= $rootScope.customers[i].ignoreUntil) {
                    if($rootScope.customers[i].address) {
                        var customerLocation = new google.maps.LatLng($rootScope.customers[i].address.geometry.location.k, $rootScope.customers[i].address.geometry.location.B);

                        // All of this is temporary for debugging purposes.
                        var dist = Geolocation.distanceFromCustomer($rootScope.currentLocation,customerLocation);

                        if( (i == 0) || ( dist < $rootScope.distanceFromCustomer1 ) ) {
                            $rootScope.distanceFromCustomer1 = dist;
                            $rootScope.nearestCustomer1 = $rootScope.customers[i].name;
                            //$rootScope.$apply();
                            console.log("Found nearest custoemr  ************** "+$rootScope.customers[i].name + " distance is " + dist);
                        }
                        // ================== END OF DEBUGGING ====================

                        if (Geolocation.isCloseToCustomer($rootScope.currentLocation,customerLocation)) {
                            arrivingAtCustomer($rootScope.customers[i]);
                            return;
                        }
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

            window.plugin.notification.local.add({ message: 'Customer found. start work?!' });

            navigator.notification.confirm( msg,
                                            function(buttonIndex){
                                                arrivingAtCustomerConfirmed(buttonIndex, customer);
                                            },
                                            $translate.instant('CUSTOMER_LOCATED'),
                                            [$translate.instant('YES'),$translate.instant('SNOOZE'),$translate.instant('IGNORE_FOR_1_HOUR')]);
        };
        var arrivingAtCustomerConfirmed = function(buttonIndex,customer) {

            if (buttonIndex == 1) {
                startUpdateTimer(1);
                $rootScope.startNewWorkItem(customer,true);
            } else {
                startUpdateTimer(5);
                if (buttonIndex == 3) {
                    customer.ignoreUntil = new Date();
                    customer.ignoreUntil.setHours(customer.ignoreUntil.getHours()+1);
                }
            }
        };
        var checkIfLeavingCustomer = function() {
            var customerLocation = new google.maps.LatLng($rootScope.currentWorkItem.customer.address.geometry.location.k,
                $rootScope.currentWorkItem.customer.address.geometry.location.B);

            if(Geolocation.isFarFromCustomer($rootScope.currentLocation,customerLocation)) {
                window.plugin.notification.local.add({ message: 'Leaving customer? Close work item?!' });
            	var msg = $translate.instant('Q_CLOSE_WORK_FOR') + ':\r\n' + $rootScope.currentWorkItem.customer.name;
                stopTimer();
                var finishWorkItem = confirm(msg);
                if (finishWorkItem) {
                    $rootScope.finishCurrentWorkItem();
                    startUpdateTimer(5);
                } else {
                    startUpdateTimer(1);
                }



            }
        };
        var periodicUpdate = function() {
            console.log("************** Periodic update is called ************** user is " + $rootScope.currentUser);
            if($rootScope.currentUser) {
                if($rootScope.currentLocation)
                    if ($rootScope.currentWorkItem) {
                        updateCurrentWorkItem();
                        if($rootScope.currentWorkItem.startedByLocation)
                            checkIfLeavingCustomer();
                    }
                    else
                        checkForNewWorkItem();
            }
        };
        var checkForNewWorkItem = function () {
            checkForCustomerProximity();
        };

        var updateCurrentWorkItem = function () {
            console.log("************** updateCurrentWorkItem is called ************** ");
            $rootScope.currentWorkItem.finish = new Date();
        };

        var stopTimer = function () {
            if (angular.isDefined(stop)) {
                $interval.cancel(stop);
                stop = undefined;
            }
        };

        var startUpdateTimer = function (secs) {
            stop = $interval(periodicUpdate, secs * 1000);
        };

        $rootScope.startNewWorkItem = function(customer,startedByLocation){
            if(customer == null)
                return;

            $rootScope.currentWorkItem = new WorkItem();
            $rootScope.currentWorkItem.customer = customer;
            $rootScope.currentWorkItem.start = new Date();
            $rootScope.currentWorkItem.isComplete = false;
            $rootScope.currentWorkItem.owner = $rootScope.currentUser;
            $rootScope.currentWorkItem.rate = customer.ratePerHour;
            $rootScope.currentWorkItem.startedByLocation = startedByLocation;
            $rootScope.currentWorkItem.save();
            $rootScope.$apply();

        };
        $rootScope.finishCurrentWorkItem = function () {
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

        var locationChanged = function(location) {
            console.log('============ Location changed to :  ' + location.latitude + ',' + location.longitude+ ' =============');
            $rootScope.currentLocation = new google.maps.LatLng(location.latitude, location.longitude);
            //periodicUpdate(location);
            bgGeo.finish();
        };

        var locationFailed = function(error) {
            console.log('------------- BackgroundGeoLocation error ---------------' + error);
        };

        this.initialize = function () {
            $rootScope.$watch('currentUser', function(newValue, oldValue) {
                $rootScope.loadCustomerList();
            });
            window.plugin.notification.local.cancelAll();
            startUpdateTimer(5);
        };

        var initBgGeo = function() {
            if(bgGeo)
                return;

            console.log(" ========== Init bg geolocation starting ");
            window.navigator.geolocation.getCurrentPosition(function(location) {
                console.log(" ======= got location ========= " + location);
                locationChanged(location.ccords,true);
            });

            bgGeo = window.plugins.backgroundGeoLocation;
            var options = {
                desiredAccuracy: 10,
                stationaryRadius: 20,
                distanceFilter: 30,
                activityType: 'Fitness',
                stopOnTerminate: true
            };
            bgGeo.configure(locationChanged, locationFailed,options);
            bgGeo.start();
            console.log(" ========== Init bg geolocation finished ");
        }

    }]);