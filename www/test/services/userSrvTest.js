/**
 * Created by eladsof on 3/9/15.
 */
/**
 * Created by eladsof on 3/2/15.
 */
describe('UserSrv Unit Tests', function() {

    var userSrv;
    var rootScope;
    var userMock,customerMock,workItemMock,ionicLoadingMock;
    var provide;

    beforeEach(function() {

        Parse = {
            Object :
            {
                extend : {}
            },
            initialize : function() {}
        };

        module('recnaleerfClientApp');
        userMock = jasmine.createSpyObj('MyUser', ['logOut','current','logIn','createNew','signUp']);
        customerMock = jasmine.createSpyObj('Customer', ['1']);
        workItemMock = jasmine.createSpyObj('WorkItem', ['1']);
        ionicLoadingMock = jasmine.createSpyObj('$ionicLoading', ['show']);

        userMock.createNew = function() {return userMock};
        userMock.signUp = jasmine.createSpy();

        module(function ($provide) {
            $provide.value('MyUser', userMock);
            $provide.value('Customer', customerMock);
            $provide.value('WorkItem', workItemMock);
            $provide.value('$ionicLoading',ionicLoadingMock);
            provide = $provide;
        });

        inject(function ($rootScope,_UserSrv_) {
            userSrv = _UserSrv_;
            rootScope = $rootScope;
        });
    });

    describe('Method isLoggedIn', function(){
        it('should return true when user is logged in', function() {
            rootScope.currentUser = {};
            expect(userSrv.isLoggedIn()).toBeTruthy();
        });

        it('should return false when user is not logged in', function() {
            expect(userSrv.isLoggedIn()).toBeFalsy();
        });
    });

    describe('Method Logout', function (){
        it('should clear current user', function() {
            rootScope.currentUser = {};
            userSrv.logout();
            expect(rootScope.currentUser).toBeNull();
        });
        it('should call logout method of user', function() {
            userSrv.logout();
            expect(userMock.logOut).toHaveBeenCalled();
        });
    });

    describe('Method signin', function (){
        it('should show waiting screen', function() {
            usr = {username:'name',password:'pass'};
            userSrv.signin(usr);
            expect(ionicLoadingMock.show).toHaveBeenCalled();
        });
        it('should call login of user', function() {
            usr = {username:'name',password:'pass'};
            userSrv.signin(usr);
            expect(userMock.logIn).toHaveBeenCalledWith(usr.username,usr.password,jasmine.any(Object) );
        });
    });

    describe('Method signup', function (){
        it('should show waiting screen', function() {
            usr = {username:'name',password:'pass'};
            userSrv.signup(usr);
            expect(ionicLoadingMock.show).toHaveBeenCalled();
        });
        it('should call login of user', function() {
            usr = {username:'name',password:'pass'};
            userSrv.signup(usr);
            expect(userMock.signUp).toHaveBeenCalled();
        });
    });
});