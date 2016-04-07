(function () {

    angular.module('angular-select-bootstrap')
        .directive('clickOutside', Directive);

    
    function Directive($document, $parse) {
        return {
            link: function (scope, element, attrs, controller) {
                    
                var onClick = function (event) {
                    var isChild = element[0].contains(event.target);
                    var isSelf = element[0] == event.target;
                    var isInside = isChild || isSelf;
                    if (!isInside) {
                        scope.$apply(attrs.clickOutside)
                    }
                }
                
                $document.bind('click', onClick);
                
                /*scope.$watch(attrs.clickOutsideActive, function(newValue, oldValue) {
                    if (newValue !== oldValue && newValue == true) {
                        $document.bind('click', onClick);
                    } else if (newValue !== oldValue && newValue == false) {
                        $document.unbind('click', onClick);
                    }
                });*/
            }
        };
    }

})();;