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
                        var selectedChilds = 0;
                        for(var i = 0; i < item.children.length; i++) {
                            var child =  item.children[i];
                            if(child.$$selected || (child.$$checkbox && (child.$$checkbox.prop('checked')))) {
                                selectedChilds++;
                            }
                        }

                        if(selectedChilds == 0) {
                            item.$$checkbox.prop('indeterminate', false);
                            item.$$selected = false;
                        } else if (selectedChilds != item.children.length){
                            item.$$checkbox.prop('indeterminate', true);
                            item.$$selected = false;
                        } else {
                            item.$$checkbox.prop('indeterminate', false);
                            item.$$selected = selectedChilds == item.children.length;
                        }

                        indeterminate(item.$$parent);
                    }
                }
            }
        };
    }

})();