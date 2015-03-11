/**
 * Created by eladsof on 3/2/15.
 */
describe('Account Ctrl Unit Tests', function() {

    var scope, ctrl;
    var userMock,customerMock,workItemMock;

    beforeEach(function () {
        module('recnaleerfClientApp');
        Parse = {
            Object :
            {
                extend : {}
            },
            initialize : function() {}
        };

        module('recnaleerfClientApp');
        userMock = jasmine.createSpyObj('MyUser', ['logOut','current']);
        customerMock = jasmine.createSpyObj('Customer', ['1']);
        workItemMock = jasmine.createSpyObj('WorkItem', ['1']);

        module(function ($provide) {
            $provide.value('MyUser', userMock);
            $provide.value('Customer', customerMock);
            $provide.value('WorkItem', workItemMock);

        });

        inject(function ($rootScope, $controller,_$state_) {

            scope = $rootScope.$new();
            scope.currentUser = 'usrObj';

            ctrl = $controller('AccountCtrl', {
                $scope: scope,
                $rootScope: scope,
                MyUser: userMock,
                $state: _$state_
            });
        });
    });

    it('should have a $scope variable', function() {
        expect(scope).toBeDefined();
        expect(scope.currentUser).toBeDefined();

    });

    it('should clear user when logout is successful', function() {
        userMock.logOut.and.returnValue(true);
        scope.logout();
        expect(scope.currentUser).toBeNull();
    });

    it('should keep current user when logout fails', function() {
        userMock.logOut.and.returnValue(false);
        scope.logout();
        expect(scope.currentUser).toEqual( 'usrObj' );
    });

});