(function () {

    angular.module('angular-select-bootstrap')
        .directive('dropdownDisplayFilter', Directive);

    function Directive($compile) {
        return {
            restrict: 'A',
            require: '^dropdownSelection',
            link: function(scope, element, attrs, dropdownSelectionCtrl) {
                var filter = dropdownSelectionCtrl.options.filter;
                if(filter) {
                    var bind = element.attr('ng-bind');

                    if(!bind) {
                        bind = element.attr('ng-bind-html');
                    }

                    if(bind) {
                        bind = bind + ' | ' + filter;
                        element.attr('ng-bind', bind);
                        element.removeAttr('dropdown-display-filter');
                        $compile(element)(scope);
                    }
                }
            }
        };
    }

})();