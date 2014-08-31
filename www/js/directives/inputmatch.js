angular.module('inputMatch',[])
 .directive('match', function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            scope: {
                match: '='
            },
            link: function(scope, elem, attrs, ctrl) {

                scope.$watch(function() {
                    return (ctrl.$pristine && angular.isUndefined(ctrl.$viewValue)) || scope.match === ctrl.$viewValue;
                }, function(currentValue) {
                    ctrl.$setValidity('match', currentValue);
                });
            }
        };
    });
