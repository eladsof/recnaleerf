

var FLOAT_REGEXP = /^\-?\d+((\.|\,)\d+)?$/;
        angular.module('positiveFloat', [])
            .directive('positiveFloat', function () {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
                if (FLOAT_REGEXP.test(viewValue) && parseFloat(viewValue.replace(',', '.'))>0) {
                    ctrl.$setValidity('float', true);
                    return parseFloat(viewValue.replace(',', '.'));
                } else {
                    ctrl.$setValidity('float', false);
                    return undefined;
                }
            });
        }
    };
});
