/*global angular*/

(function() {
    'use strict';

    angular
        .module('angular-click-outside', [])
        .directive('clickOutside', ['$document', '$parse', '$timeout', clickOutside]);

    function clickOutside($document, $parse, $timeout) {
        return {
            restrict: 'A',
            link: function($scope, elem, attr) {
                
                // postpone linking to next digest to allow for unique id generation
                $timeout(function() {
                    var classList = (attr.outsideIfNot !== undefined) ? attr.outsideIfNot.replace(', ', ',').split(',') : [],
                        fn;

                    // add the elements id so it is not counted in the click listening
                    if (attr.id !== undefined) {
                        classList.push(attr.id);
                    }

                    function eventHandler(e) {

                        // check if our element already hidden and abort if so
                        if (angular.element(elem).hasClass("ng-hide")) {
                            return;
                        }

                        var i = 0,
                            element;

                        // if there is no click target, no point going on
                        if (!e || !e.target) {
                            return;
                        }

                        // loop through the available elements, looking for classes in the class list that might match and so will eat
                        for (element = e.target; element; element = element.parentNode) {
                            var id = element.id,
                                classNames = element.className,
                                l = classList.length;

                            // Unwrap SVGAnimatedString classes
                            if (classNames && classNames.baseVal !== undefined) {
                                classNames = classNames.baseVal;
                            }

                            // loop through the elements id's and classnames looking for exceptions
                            for (i = 0; i < l; i++) {
                                // check for exact matches on id's or classes, but only if they exist in the first place
                                if ((id !== undefined && id === classList[i]) || (classNames && classNames === classList[i])) {
                                    // now let's exit out as it is an element that has been defined as being ignored for clicking outside
                                    return;
                                }
                            }
                        }

                        // if we have got this far, then we are good to go with processing the command passed in via the click-outside attribute
                        $scope.$apply(function() {
                            fn = $parse(attr['clickOutside']);
                            fn($scope);
                        });
                    }

                    // if the devices has a touchscreen, listen for this event
                    if (_hasTouch()) {
                        $document.on('touchstart', eventHandler);
                    }

                    // still listen for the click event even if there is touch to cater for touchscreen laptops
                    $document.on('click', eventHandler);

                    // when the scope is destroyed, clean up the documents event handlers as we don't want it hanging around
                    $scope.$on('$destroy', function() {
                        if (_hasTouch()) {
                            $document.off('touchstart', eventHandler);
                        }

                        $document.off('click', eventHandler);
                    });

                    // private function to attempt to figure out if we are on a touch device
                    function _hasTouch() {
                        // works on most browsers, IE10/11 and Surface
                        return 'ontouchstart' in window || navigator.maxTouchPoints;
                    };
                });
            }
        };
    }
})();

(function() {
    'use strict'

    angular.module('angular-select-bootstrap', [
        
        'angular-click-outside' 

    ]);

})();

(function () {

    Controller.$inject = ['$scope'];
    angular.module('angular-select-bootstrap')
        .controller('DropdownSelectionCtrl', Controller);

    /* @ngInject */
    function Controller($scope) {

        var that = this;
        this.oppened = false;
        this.selectedItems = [];

        var addSelectedItem = function(item) {
            if(that.selectedItems.indexOf(item) == -1) {
                that.selectedItems.push(item);
            }
        }

        var removeSelectedItem = function(item) {
            var index = that.selectedItems.indexOf(item);
            that.selectedItems.splice(index, 1);
        }

        var selectAllChildren = function(item) {
            var model = that.getModel();
            angular.forEach(item.children, function(item) {
                var index = model.indexOf(item[that.options.idProperty]);
                var exist = index != -1;
                if(!exist) {
                    model.push(item[that.options.idProperty]);
                    addSelectedItem(item);
                    selectAllChildren(item);
                }
            });
        }

        var unselectAllChildren = function(item) {
            var model = that.getModel();
            angular.forEach(item.children, function(item) {
                var index = model.indexOf(item[that.options.idProperty]);
                var exist = index != -1;
                if(exist) {
                    model.splice(index, 1);
                    removeSelectedItem(item);
                    unselectAllChildren(item);
                }
            });
        }

        this.toggle = function() {
            this.oppened = !this.oppened;
        }

        this.close = function() {
            if(this.oppened) {
                this.oppened = false
            }
        }

        this.getModel = function() {
            return this.ngModel.$modelValue;
        }

        this.selectItem = function(item) {
            var model = this.getModel();
            if(model == undefined) {
                model = [];
                this.ngModel.$setViewValue(model, true);
            }

            var index = model.indexOf(item[that.options.idProperty]);
            var exist = index != -1;

            if(!exist) {
                model.push(item[that.options.idProperty]);
                addSelectedItem(item);
                selectAllChildren(item);
            } else if(exist) {
                model.splice(index, 1);
                removeSelectedItem(item);
                unselectAllChildren(item);
            }
        }
        
        this.openItem = function(item) {
            item.$$openned = !item.$$openned;
        }

        this.unselectAllItems = function() {
            var model = this.getModel();
            model.length = 0;
            this.selectedItems.length = 0;
        }

        this.initItem = function(item, parent) {
            var model = this.getModel();
            if(model.indexOf(item[that.options.idProperty]) != -1) {
                parent.$$openned = true;
                addSelectedItem(item);
            }
        }

    }

})();
(function () {

    angular.module('angular-select-bootstrap')
        .directive('dropdownMenu', Directive);

    function Directive() {
        return {
            restrict: 'E',
            require: '^dropdownSelection',
            templateUrl: 'angular-select-bootstrap/dropdownMenu.tpl.html',
            replace: true,
            scope: {
                parent: "=",
                items: "="
            },
            link: function(scope, element, attr, dropdownSelection) {
                scope.dropdownSelectionCtrl = dropdownSelection;
            }
        };
    }

})();
(function () {

    Directive.$inject = ['$parse'];
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
                items: "="
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
                    multipleSelection: true,
                    maxTerm: 'Selecteds...',
                    maxShow: 2,
                    idProperty: 'id'
                }

                ctrl.options = angular.extend(defaultOptions, options);
            }
        };
    }

})();
angular.module("angular-select-bootstrap").run(["$templateCache", function($templateCache) {$templateCache.put("angular-select-bootstrap/dropdownMenu.tpl.html","<ul id=\"dropdownSelectionMenu\" class=\"dropdown-menu\">\n    <li ng-repeat=\"item in items\" ng-init=\"dropdownSelectionCtrl.initItem(item, parent)\" ng-click=\"dropdownSelectionCtrl.selectItem(item); $event.stopPropagation();\" ng-class=\"{group: item.children.length, open: item.$$openned}\">\n        <a href=\"#\">\n            <span class=\"group icon\" ng-click=\"dropdownSelectionCtrl.openItem(item); $event.stopPropagation();\"></span>\n            <input type=\"checkbox\" ng-checked=\"dropdownSelectionCtrl.selectedItems.indexOf(item) != -1\">\n            {{ item.title }}\n        </a>\n        <dropdown-menu class=\"group\" parent=\"item\" items=\"item.children\"></dropdown-menu>\n    </li>\n</ul>");
$templateCache.put("angular-select-bootstrap/dropdownSelection.tpl.html","<div class=\"dropdown selection\" ng-class=\"{open: dropdownSelectionCtrl.oppened}\" click-outside=\"dropdownSelectionCtrl.close()\" outside-if-not=\"dropdownSelectionButton, dropdownSelectionMenu\">\n    <button id=\"dropdownSelectionButton\" class=\"btn btn-default dropdown-toggle\" type=\"button\" ng-click=\"dropdownSelectionCtrl.toggle()\" ng-switch=\"dropdownSelectionCtrl.selectedItems.length > dropdownSelectionCtrl.options.maxShow\">\n        <span class=\"label label-default\" ng-repeat=\"item in dropdownSelectionCtrl.selectedItems\" ng-switch-when=\"false\">\n            {{ item.title }}\n            <i class=\"remove glyphicon glyphicon-remove\" ng-click=\"dropdownSelectionCtrl.selectItem(item)\"></i>\n        </span>\n        <span class=\"label label-default\" ng-switch-when=\"true\">\n            {{ dropdownSelectionCtrl.selectedItems.length }} {{ ::dropdownSelectionCtrl.options.maxTerm }}\n            <i class=\"remove glyphicon glyphicon-remove\" ng-click=\"dropdownSelectionCtrl.unselectAllItems()\"></i>\n        </span>\n        <span class=\"caret\"></span>\n    </button>\n    <dropdown-menu items=\"dropdownSelectionCtrl.items\"></dropdown-menu>\n</div>");}]);