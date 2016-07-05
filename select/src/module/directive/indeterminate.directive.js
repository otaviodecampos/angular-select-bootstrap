(function () {

    angular.module('angular-select-bootstrap')
        .directive('dropdownIndeterminate', Directive);

    function Directive() {
        return {
            scope: {
                dropdownIndeterminate: "="
            },
            require: '^dropdownSelection',
            link: function(scope, element, attrs, modelCtrl) {
                var item = scope.dropdownIndeterminate;
                item.$$checkbox = element;

                scope.$watch('dropdownIndeterminate.$$selected', function() {
                    indeterminate(item.$$parent);
                });

                function indeterminate(item) {
                    if(item) {
                        var hasChecked = false;
                        var hasUnchecked = false;
                        var hasIndeterminate = false;

                        for(var i = 0; i < item.children.length; i++) {
                            var child =  item.children[i];
                            if(child.$$selected) {
                                hasChecked = true;
                            } else {
                                hasUnchecked = true;
                            }

                            if(child.$$checkbox && child.$$checkbox.prop('indeterminate')) {
                                hasIndeterminate = true;
                            }

                        }

                        if((hasChecked && hasUnchecked) || (!hasChecked && hasIndeterminate)) {
                            item.$$checkbox.prop('indeterminate', true);
                            item.$$selected = false;
                        } else {
                            item.$$checkbox.prop('indeterminate', false);
                            item.$$selected = hasChecked;
                        }

                        indeterminate(item.$$parent);
                    }
                }
            }
        };
    }

})();