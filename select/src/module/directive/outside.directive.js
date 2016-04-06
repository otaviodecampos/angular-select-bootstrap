(function () {

    angular.module('angular-select-bootstrap')
        .directive('clickOutside', Directive);

    
    function Directive($document) {
        return {
            link: {
                pre: function (scope, element, attrs, controller) { },
                post: function (scope, element, attrs, controller) {
                    onClick = function (event) {
                        var isChild = element[0].contains(event.target);
                        var isSelf = element[0] == event.target;
                        var isInside = isChild || isSelf;
                        if (!isInside) {
                            scope.$apply(attrs.clickOutside)
                        }
                    }
                    $document.on('click', onClick);
                }
            }   
        };
    }

})();