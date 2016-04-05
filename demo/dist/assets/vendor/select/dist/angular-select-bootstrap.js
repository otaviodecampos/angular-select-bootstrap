(function() {
    'use strict'

    angular.module('angular-select-bootstrap', [
        

    ]);

})();

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
angular.module("angular-select-bootstrap").run(["$templateCache", function($templateCache) {$templateCache.put("angular-select-bootstrap/dropdownSelection.tpl.html","<div class=\"dropdown selection\">\n    <button class=\"btn btn-default dropdown-toggle\" type=\"button\">\n    <ul class=\"dropdown-menu\">\n        <li>oi</li>\n    </ul>\n</div>");}]);