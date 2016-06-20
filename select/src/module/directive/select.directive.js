(function () {

    angular.module('angular-select-bootstrap')
        .directive('dropdownSelection', Directive);

    function Directive($parse) {
        return {
            restrict: 'E',
            require: 'ngModel',
            templateUrl: 'angular-select-bootstrap/dropdownSelection.tpl.html',
            controller: "DropdownSelectionCtrl as dropdownSelectionCtrl",
            replace: true,
            scope: {
                items: "=",
                onClose: "&",
                onOpen: "&"
            },
            bindToController: true,
            link: function(scope, element, attrs, ngModel) {
                var ctrl = scope.dropdownSelectionCtrl
                    , ngModelAttr = element.attr('ng-model')
                    , options = $parse(attrs.options)(scope);

                ctrl.ngModel = ngModel;
                ctrl.ngModelGetter = $parse(ngModelAttr);
                ctrl.ngModelSetter = ctrl.ngModelGetter.assign;

                var defaultOptions = {
                    maxTerm: 'Selecteds...',
                    idProperty: 'id',
                    multiple: true,
                    editable: false,
                    placeholder: 'Empty title',
                    selectClose: false
                }

                ctrl.options = angular.extend(defaultOptions, options);
                
                if(ctrl.options.editable) {
                    ctrl.options.multiple = false;
                }
                
                if(ctrl.options.multiple) {
                    ctrl.mode = 'multiple';
                } else {
                    if(ctrl.options.editable) {
                        ctrl.mode = 'unique-editable'   
                    } else {
                        ctrl.mode = 'unique'
                    }
                }
                
                
            }
        };
    }

})();