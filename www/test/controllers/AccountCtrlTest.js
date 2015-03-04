/**
 * Created by eladsof on 3/2/15.
 */
describe('Account Ctrl Unit Tests', function() {

    var scope, ctrl;
    var userMock;

    beforeEach(function () {
        userMock = jasmine.createSpyObj('MyUser', ['logOut']);

        module('recnaleerfClientApp');


        inject(function ($rootScope, $controller,_$state_,MyUser) {

            scope = $rootScope.$new();
            scope.currentUser = new MyUser();

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

});