(function() {
    'use strict'

    angular.module('angular-select-bootstrap', [
        

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
                var index = model.indexOf(item);
                var exist = index != -1;
                if(!exist) {
                    model.push(item);
                    addSelectedItem(item);
                    selectAllChildren(item);
                }
            });
        }

        var unselectAllChildren = function(item) {
            var model = that.getModel();
            angular.forEach(item.children, function(item) {
                var index = model.indexOf(item);
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
            var model = this.ngModel.$modelValue;
            if(model == undefined) {
                if(this.options.multiple) {
                    model = [];   
                    this.ngModel.$setViewValue(model, true);
                }
            }
            return model;
        }
        
        this.setModelValue = function(value) {
            var model = this.getModel();
            this.ngModel.$setViewValue(value, true);
        }

        this.selectItem = function(item, cascade) {
            var model = this.getModel();

            if(cascade == undefined) {
                cascade = true;
            }

            if(this.options.multiple) {
                var index = model.indexOf(item);
                var exist = index != -1;
    
                if(!exist) {
                    model.push(item);
                    if(cascade) {
                        selectAllChildren(item);   
                    }
                    addSelectedItem(item);
                } else if(exist) {
                    model.splice(index, 1);
                    removeSelectedItem(item);
                    if(cascade) {
                        unselectAllChildren(item);   
                    }
                }
            } else {
                this.unselectAllItems();
                if(item) {
                    addSelectedItem(item);
                    this.setModelValue(item);
                } else {
                    this.setModelValue(null);
                }
            }
        }
        
        
        this.openItem = function(item) {
            item.$$openned = !item.$$openned;
        }
        
        this.unselectItem = function(item) {
            this.selectItem(this.options.multiple && item || null, false);
        }

        this.unselectAllItems = function() {
            if(this.options.multiple) {
                var model = this.getModel();
                model.length = 0;    
            }
            
            this.selectedItems.length = 0;
        }

        this.initItem = function(item, parent) {
            var model = this.getModel()
                , selected = false;

            if(this.options.multiple && model) {
                angular.forEach(model, function(modelItem) {
                    if(modelItem[that.options.idProperty] == item[that.options.idProperty]) {
                        selected = true;
                        return false;
                    }
                });
            }

            if(model == item || selected) {
                if(parent) {
                    parent.$$openned = true;
                }
                if(!this.options.multiple) {
                    this.unselectAllItems();
                }
                addSelectedItem(item);
            }
        }

        $scope.$watch(function () {
            return that.ngModel.$modelValue;
        }, function(newValue) {
            if(!newValue) {
                that.unselectAllItems();
            }
        });

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

    Directive.$inject = ['$document'];
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
                    maxTerm: 'Selecteds...',
                    idProperty: 'id',
                    multiple: true,
                    editable: false,
                    placeholder: 'Empty title'
                }

                ctrl.options = angular.extend(defaultOptions, options);
                
                if(ctrl.options.editable) {
                    ctrl.options.multiple = false;
                }
            }
        };
    }

})();
angular.module("angular-select-bootstrap").run(["$templateCache", function($templateCache) {$templateCache.put("angular-select-bootstrap/dropdownMenu.tpl.html","<ul class=\"dropdown-menu\">\r\n    <li ng-repeat=\"item in items\" ng-init=\"dropdownSelectionCtrl.initItem(item, parent)\" ng-class=\"{group: item.children.length, open: item.$$openned}\">\r\n        <a href=\"javascript:angular.noop()\" ng-click=\"dropdownSelectionCtrl.selectItem(item); $event.stopPropagation();\">\r\n            <span class=\"group icon\" ng-click=\"dropdownSelectionCtrl.openItem(item); $event.stopPropagation();\"></span>\r\n            <input type=\"checkbox\" ng-click=\"dropdownSelectionCtrl.selectItem(item); $event.stopPropagation();\" readonly ng-if=\"dropdownSelectionCtrl.options.multiple\" ng-checked=\"dropdownSelectionCtrl.selectedItems.indexOf(item) != -1\">\r\n            <span class=\"glyphicon glyphicon-ok check-mark\" ng-if=\"!dropdownSelectionCtrl.options.multiple && dropdownSelectionCtrl.selectedItems.indexOf(item) != -1\"></span>\r\n            <span class=\"title\">{{ item.title || dropdownSelectionCtrl.options.placeholder }}</span>\r\n        </a>\r\n        <dropdown-menu class=\"group\" parent=\"item\" items=\"item.children\"></dropdown-menu>\r\n    </li>\r\n</ul>");
$templateCache.put("angular-select-bootstrap/dropdownSelection.tpl.html","<div class=\"dropdown selection\" ng-class=\"{open: dropdownSelectionCtrl.oppened}\" click-outside=\"dropdownSelectionCtrl.close()\">\r\n    <button class=\"btn btn-default dropdown-toggle\" type=\"button\" ng-if=\"dropdownSelectionCtrl.options.multiple\" ng-click=\"dropdownSelectionCtrl.toggle()\" ng-switch=\"dropdownSelectionCtrl.selectedItems.length > dropdownSelectionCtrl.options.maxShow\">\r\n        <span class=\"label label-default\" ng-repeat=\"item in dropdownSelectionCtrl.selectedItems\" ng-switch-when=\"false\">\r\n            {{ item.title }}\r\n            <i class=\"remove glyphicon glyphicon-remove\" ng-click=\"dropdownSelectionCtrl.unselectItem(item)\"></i>\r\n        </span>\r\n        <span class=\"label label-default\" ng-switch-when=\"true\">\r\n            {{ dropdownSelectionCtrl.selectedItems.length }} {{ ::dropdownSelectionCtrl.options.maxTerm }}\r\n            <i class=\"remove glyphicon glyphicon-remove\" ng-click=\"dropdownSelectionCtrl.unselectAllItems()\"></i>\r\n        </span>\r\n        <span class=\"caret\"></span>\r\n    </button>\r\n    <label class=\"btn btn-default dropdown-toggle\" type=\"button\" ng-if=\"!dropdownSelectionCtrl.options.multiple\" ng-click=\"dropdownSelectionCtrl.toggle()\" ng-switch=\"dropdownSelectionCtrl.selectedItems[0] && dropdownSelectionCtrl.options.editable\">\r\n        <span class=\"title\" ng-switch-when=\"false\">{{ dropdownSelectionCtrl.selectedItems[0].title }}</span>\r\n        <input class=\"edit\" placeholder=\"{{ dropdownSelectionCtrl.options.placeholder }}\" ng-click=\"$event.stopPropagation()\" ng-switch-when=\"true\" ng-model=\"dropdownSelectionCtrl.selectedItems[0].title\" type=\"text\"/>\r\n        <span class=\"caret\"></span>\r\n    </label>\r\n    <dropdown-menu ng-if=\"dropdownSelectionCtrl.oppened\" items=\"dropdownSelectionCtrl.items\"></dropdown-menu>\r\n</div>");}]);