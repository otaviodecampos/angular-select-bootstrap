(function () {

    angular.module('angular-select-bootstrap')
        .directive('dropdownSelection', Directive);

    function Directive() {
        return {
            restrict: 'E',
            templateUrl: 'angular-select-bootstrap/dropdownSelection.tpl.html',
            replace: true,
            scope: {
                items: "="
            }
        };
    }

})();