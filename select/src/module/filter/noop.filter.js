(function() {
    'use strict'

    angular.module('angular-select-bootstrap')
        .filter('noop', Filter);

    function Filter() {
        return function(text) {
            return text;
        }
    }

})();