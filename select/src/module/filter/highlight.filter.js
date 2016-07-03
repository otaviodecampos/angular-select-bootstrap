(function() {
    'use strict'

    angular.module('angular-select-bootstrap')
        .filter('dropdownHighlight', Filter);

    function Filter($sce) {
        return function(text, search) {
            if (!search) {
                return $sce.trustAsHtml(text);
            }
            try {
                var reg = new RegExp(search, 'gi');
            } catch(e) {
                reg = new RegExp();
            }


            return $sce.trustAsHtml(text.replace(reg, '<span class="dropdown-highlighted">$&</span>'));
        }
    }

})();