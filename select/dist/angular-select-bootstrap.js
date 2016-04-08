(function() {
    'use strict'

    angular.module('angular-select-bootstrap', [
        

    ]);

})();

(function () {

    Controller.$inject = ['$scope', '$document', '$element'];
    angular.module('angular-select-bootstrap')
        .controller('DropdownSelectionCtrl', Controller);

    /* @ngInject */
    function Controller($scope, $document, $element) {

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

        this.contains = function(item) {
            var contains = false;
            angular.forEach(this.selectedItems, function(selectedItem) {
                if(selectedItem[that.options.idProperty] == item[that.options.idProperty]) {
                    contains = true;
                    return false;
                }
            });
            return contains;
        }

        var onClick;
        this.toggle = function() {
            this.oppened = !this.oppened;
            if(this.oppened) {
                onClick = function (event) {
                    var isChild = $element[0].contains(event.target);
                    var isSelf = $element[0] == event.target;
                    var isInside = isChild || isSelf;
                    if (!isInside) {
                        that.close();
                        $scope.$apply();
                    }
                }
                
                $document.bind('click', onClick);
            }
        }

        this.close = function() {
            if(this.oppened) {
                this.oppened = false
                $document.unbind('click', onClick);
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
            
            if(this.options.selectClose) {
                this.close();
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

        var initItem = function(item, parent) {
            var model = that.getModel()
                , selected = false;

            if(that.options.multiple && model) {
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
                if(!that.options.multiple) {
                    that.unselectAllItems();
                }
                addSelectedItem(item);
            }
        }

        $scope.$watch(function () {
            return that.ngModel.$modelValue;
        }, function(newValue) {
            if(!newValue) {
                that.unselectAllItems();
            } else if(!angular.isArray(newValue)) {
                initItem(newValue);
            }
        });

        
        var initModelItem = function(item, parent) {
            initItem(item);
            angular.forEach(item.children, function(children) {
                initModelItem(children, item);
            });
        }
        
        var initItems = function(items) {
            angular.forEach(items, function(item) {
                initModelItem(item);
            });
        }
        
        var init = $scope.$watch('dropdownSelectionCtrl.items', function(newValue) {
            if(newValue) {
                initItems(newValue);
                init();
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
angular.module("angular-select-bootstrap").run(["$templateCache", function($templateCache) {$templateCache.put("angular-select-bootstrap/dropdownMenu.tpl.html","<ul class=\"dropdown-menu\">\r\n    <li ng-repeat=\"item in items\" ng-class=\"{group: item.children.length, open: item.$$openned}\">\r\n        <a href=\"javascript:angular.noop()\" ng-click=\"dropdownSelectionCtrl.selectItem(item); $event.stopPropagation()\">\r\n            <span class=\"group icon\" ng-click=\"dropdownSelectionCtrl.openItem(item); $event.stopPropagation()\"></span>\r\n            <input type=\"checkbox\" ng-click=\"dropdownSelectionCtrl.selectItem(item); $event.stopPropagation()\" ng-if=\"dropdownSelectionCtrl.options.multiple\" ng-checked=\"dropdownSelectionCtrl.contains(item)\">\r\n            <span class=\"glyphicon glyphicon-ok check-mark\" ng-if=\"!dropdownSelectionCtrl.options.multiple && dropdownSelectionCtrl.contains(item)\"></span>\r\n            <span class=\"title\">{{ item.title || dropdownSelectionCtrl.options.placeholder }}</span>\r\n        </a>\r\n        <dropdown-menu ng-if=\"item.$$openned\" class=\"group\" parent=\"item\" items=\"item.children\"></dropdown-menu>\r\n    </li>\r\n</ul>");
$templateCache.put("angular-select-bootstrap/dropdownSelection.tpl.html","<div class=\"dropdown selection\" ng-class=\"{open: dropdownSelectionCtrl.oppened}\" click-outside=\"dropdownSelectionCtrl.close()\" click-outside-active=\"dropdownSelectionCtrl.oppened\" ng-switch=\"dropdownSelectionCtrl.mode\">\r\n    <button ng-switch-when=\"multiple\" class=\"btn btn-default dropdown-toggle\" type=\"button\" ng-click=\"dropdownSelectionCtrl.toggle()\" ng-switch=\"dropdownSelectionCtrl.selectedItems.length > dropdownSelectionCtrl.options.maxShow\">\r\n        \r\n        <span class=\"label label-default\" ng-switch-when=\"true\">\r\n            {{ dropdownSelectionCtrl.selectedItems.length }} {{ ::dropdownSelectionCtrl.options.maxTerm }}\r\n            <i class=\"remove glyphicon glyphicon-remove\" ng-click=\"dropdownSelectionCtrl.unselectAllItems()\"></i>\r\n        </span>\r\n        \r\n        <span class=\"label label-default\" ng-repeat=\"item in dropdownSelectionCtrl.selectedItems\" ng-switch-when=\"false\">\r\n            {{ ::item.title }}\r\n            <i class=\"remove glyphicon glyphicon-remove\" ng-click=\"dropdownSelectionCtrl.unselectItem(item)\"></i>\r\n        </span>\r\n        \r\n        <span class=\"caret\"></span>\r\n    </button>\r\n    \r\n    <label ng-switch-when=\"unique\" class=\"btn btn-default dropdown-toggle\" type=\"button\" ng-click=\"dropdownSelectionCtrl.toggle()\">\r\n        <span class=\"title\">{{ dropdownSelectionCtrl.selectedItems[0].title }}</span>\r\n        <span class=\"caret\"></span>\r\n    </label>\r\n    \r\n    <label ng-switch-when=\"unique-editable\" class=\"btn btn-default dropdown-toggle\" type=\"button\" ng-click=\"dropdownSelectionCtrl.toggle()\">\r\n        <input class=\"edit\" ng-if=\"dropdownSelectionCtrl.selectedItems[0]\" placeholder=\"{{ dropdownSelectionCtrl.options.placeholder }}\" ng-click=\"$event.stopPropagation()\" ng-model=\"dropdownSelectionCtrl.selectedItems[0].title\" type=\"text\"/>\r\n        <span class=\"caret\"></span>\r\n    </label>\r\n    \r\n    <dropdown-menu ng-if=\"dropdownSelectionCtrl.oppened\" items=\"dropdownSelectionCtrl.items\"></dropdown-menu>\r\n</div>");}]);