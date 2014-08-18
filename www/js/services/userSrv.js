'use strict';

/**
 * @ngdoc function
 * @name recnaleerfClientApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the recnaleerfClientApp
 */
angular.module('recnaleerfClientApp')
   .service('UserSrv', ['$rootScope', '$location', 'MyUser' ,function ($scope,$location,MyUser) {

    this.isLoggedIn = function() {
        console.log('is logged in called : '+ ($scope.currentUser != null));
        return $scope.currentUser != null;
    }

    this.signin = function (user){
        MyUser.logIn(user.username,user.password , {
            success: function(user)
            {
                $scope.currentUser = user;
                console.log('User '+$scope.currentUser.get('username')+' succesfully signed in');
                $location.path('/#');
                $scope.$apply();
            } ,
            error:   function(user,error)
            {
                console.log('User failed to  signed in: '+error.code+':'+error.message);
            }
        });
    };

    this.logout = function () {
        MyUser.logOut();
        $scope.currentUser = null;
        console.log('logged out');
    };

    this.signup = function (usr) {
        var newUser = new MyUser();
        newUser.set('username',usr.username);
        newUser.set('password',usr.password);
        newUser.set('email',usr.email);

        newUser.signUp(null, {
            success: function(newUser) { console.log('User '+newUser.get('username')+' succesfully signed up');} ,
            error:   function(newUser,error) {console.log('User failed to  signed up: '+error.code+':'+error.message);}
        });
    };

  }]);


