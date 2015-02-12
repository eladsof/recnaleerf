angular.module('recnaleerfClientApp')
    .service('GlobalSrv', ['$rootScope', 'Geolocation', 'Customer','MyUser','$interval','WorkItem','$ionicLoading','$translate' ,
    function ($rootScope,Geolocation,Customer,MyUser,$interval,WorkItem,$ionicLoading,$translate) {

        var stop = undefined;
        var bgGeo;

        $rootScope.currentLocation = null;
        // Debug parameters.
        $rootScope.distanceFromCustomer1 = null;
        $rootScope.nearestCustomer1 = null;

        $rootScope.loadCustomerList = function () {
            if($rootScope.currentUser){
                $ionicLoading.show();
                Customer.listByUser($rootScope.currentUser).then(function(aCustomers) {
                    $rootScope.customers = aCustomers;
                    for(var i=0;i<$rootScope.customers.length;i++)
                        $rootScope.customers[i].ignoreUntil = new Date();
                    console.log("============= Customer list updated =============== ");
                }, function(aError) {
                    console.log(aError);
                    $ionicLoading.hide();
                }).then(WorkItem.getLastItem($rootScope.currentUser).then(function(aItem) {
                   if(!aItem.isComplete){
                       $rootScope.currentWorkItem = aItem;
                       $rootScope.$apply();
                   }
                    $ionicLoading.hide();
                })).then(initBgGeo);
            }
        };

        var checkForOpenWorkItem = function(){
          if(!$rootScope.currentWorkItem){

          }
        };
        var checkForCustomerProximity = function() {
            var nearCustomers = new Array();

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
                            nearCustomers.push($rootScope.customers[i]);
                            //arrivingAtCustomer($rootScope.customers[i]);
                            //return;
                        }
                    }
                }
                else
                {
                    console.log('Ignoring customer '+$rootScope.customers[i].name+ ' because '+$rootScope.customers[i].ignoreUntil+' is smaller than '+new  Date());
                }
            }
            handleNearCustomers(nearCustomers);
        };
        var handleNearCustomers = function(customerArray){
            console.log('handleNearCustomers ' + customerArray.length);
          if(customerArray.length == 1){
              arrivingAtCustomer(customerArray[0]);
          } else if (customerArray.length > 1){
              arrivingAtMultipleCustomers(customerArray);
          }
        };
        var arrivingAtCustomer = function(customer) {
            stopTimer();

            var msg = $translate.instant('Q_START_WORK_FOR') + ':\r\n' + customer.name ;

            window.plugin.notification.local.add({ message: $translate.instant('CUSTOMER_LOCATED') });

            navigator.notification.confirm( msg,
                                            function(buttonIndex){
                                                arrivingAtCustomerConfirmed(buttonIndex, customer);
                                            },
                                            $translate.instant('CUSTOMER_LOCATED'),
                                            [$translate.instant('YES'),$translate.instant('SNOOZE'),$translate.instant('IGNORE_FOR_1_HOUR')]);
        };
        var arrivingAtMultipleCustomers = function(customerArray){
            stopTimer();
            var msg = $translate.instant('MULTIPLE_CUSTOMERS_FOUND');
            var btnArray = new Array();
            for(var i=0;i<customerArray.length;i++) {
                btnArray.push(customerArray[i].name);
            }
            btnArray.push($translate.instant('SNOOZE'));
            btnArray.push($translate.instant('IGNORE_FOR_1_HOUR'));
            window.plugin.notification.local.add({ message: $translate.instant('CUSTOMER_LOCATED') });
            navigator.notification.confirm( msg,
                function(buttonIndex){
                    if(buttonIndex <= customerArray.length) {
                        arrivingAtCustomerConfirmed(1, customerArray[buttonIndex-1]);
                    } else {
                        console.log('buttonindex = '+buttonIndex + ' Array len '+ customerArray.length);
                        buttonIndex -= customerArray.length;
                        var snoozeTime =  (buttonIndex == 1) ? 1 : 60;
                        for(var i=0;i<customerArray.length;i++) {
                            snoozeCustomer(customerArray[i],snoozeTime);
                        }
                        startUpdateTimer(5);
                    }

                },
                $translate.instant('CUSTOMER_LOCATED'),
                btnArray);

        };

        function snoozeCustomer(customer,minutes) {
            customer.ignoreUntil = new Date();
            customer.ignoreUntil.setMinutes(customer.ignoreUntil.getMinutes() + minutes);
        }

        var arrivingAtCustomerConfirmed = function(buttonIndex,customer) {

            if (buttonIndex == 1) {
                $rootScope.startNewWorkItem(customer,true);
                startUpdateTimer(1);
            } else {
                if (buttonIndex == 3) {
                    snoozeCustomer(customer,60);
                } else if (buttonIndex == 2){
                    snoozeCustomer(customer,1);
                }
                startUpdateTimer(5);
            }
        };
        var checkIfLeavingCustomer = function(){
            if(!$rootScope.currentLocation)
                return;

            var customerLocation = new google.maps.LatLng($rootScope.currentWorkItem.customer.address.geometry.location.k,
                $rootScope.currentWorkItem.customer.address.geometry.location.B);

            if(Geolocation.isFarFromCustomer($rootScope.currentLocation,customerLocation)) {
                var title = $translate.instant('LOCATION_CHANGED');
                var msg = $translate.instant('Q_CLOSE_WORK_FOR') + ':\r\n' + $rootScope.currentWorkItem.customer.name;
                window.plugin.notification.local.add({ message: msg });
                stopTimer();
                navigator.notification.confirm( msg,
                    function(buttonIndex) {
                        if (buttonIndex == 1) {
                            $rootScope.finishCurrentWorkItem();
                            startUpdateTimer(5);
                        } else {
                            startUpdateTimer(1);
                        }
                    },
                    title,
                    ['Yes','No']);
            }
        };
        var periodicUpdate = function() {
            if($rootScope.currentUser) {
                if ($rootScope.currentWorkItem) {
                    updateCurrentWorkItem();
                    if($rootScope.currentWorkItem.startedByLocation) {
                        checkIfLeavingCustomer();
                    }
                } else {
                    checkForNewWorkItem();
                }
            }
        };
        var checkForNewWorkItem = function () {
            if($rootScope.currentLocation) {
                checkForCustomerProximity();
            }

        };

        var updateCurrentWorkItem = function () {
            console.log("************** updateCurrentWorkItem is called ************** ");
            $rootScope.currentWorkItem.finish = new Date();
            $rootScope.currentWorkItem.save();
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
            $ionicLoading.show();
            $rootScope.currentWorkItem.finish = new Date();
            $rootScope.currentWorkItem.isComplete = true;
            $rootScope.currentWorkItem.save(null, {
                success: function(item) {
                    // Execute any logic that should take place after the object is saved.
                    snoozeCustomer($rootScope.currentWorkItem.customer,3);
                    var msg = $translate.instant('WORK_ITEM') + ' ' + $translate.instant('SAVED_SUCCESSFULLY') + '\r\n' + $translate.instant('CUSTOMER') + ' :'+ item.customer.name ;
                    navigator.notification.alert(msg,null,$translate.instant('SAVED_SUCCESSFULLY'));
                    $rootScope.currentWorkItem = null;
                    $ionicLoading.hide();
                },
                error: function(customer, error) {
                    // Execute any logic that should take place if the save fails.
                    // error is a Parse.Error with an error code and description.
                    var msg = $translate.instant('WORK_ITEM NOT_CREATED') +  '\r\n' + error + ':' + customer.name ;
                    navigator.notification.alert(msg,null,$translate.instant('ERROR'));
                    $ionicLoading.hide();
                }
            });

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
                stopOnTerminate: false
            };
            bgGeo.configure(locationChanged, locationFailed,options);
            bgGeo.start();
            console.log(" ========== Init bg geolocation finished ");
        }

    }]);