'use strict';

/**
 * @ngdoc function
 * @name recnaleerfClientApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the recnaleerfClientApp
 */
angular.module('recnaleerfClientApp')
   .service('UserSrv', ['$rootScope', '$location', 'MyUser' ,'$q','$ionicLoading',function ($scope,$location,MyUser,$q,$ionicLoading) {

    this.isLoggedIn = function() {
        console.log('is logged in called : '+ ($scope.currentUser != null));
        return $scope.currentUser != null;
    }

    this.signin = function (user,successFn,failureFn){
        $ionicLoading.show();
        MyUser.logIn(user.username,user.password , {
            success: successFn, error: failureFn
        });
    };

    this.logout = function () {
        MyUser.logOut();
        $scope.currentUser = null;
        console.log('logged out');
    };

    this.signup = function (usr,message) {
        $ionicLoading.show();
        var deferred;
        deferred = $q.defer();

        var newUser = new MyUser();
        newUser.username = usr.username;
        newUser.password = usr.password;
        newUser.email = usr.email;
        newUser.fullname = usr.fullname;
        newUser.address = usr.address;

        newUser.signUp(null, {
            success: function(newUser) { return deferred.resolve(newUser); },
            error:   function(newUser,error) {return deferred.reject({newUser: newUser,error: error});}
        });

        return deferred.promise;
    };

  }]);


