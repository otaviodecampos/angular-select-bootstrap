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

    Directive.$inject = ['$document', '$parse'];
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
angular.module("angular-select-bootstrap").run(["$templateCache", function($templateCache) {$templateCache.put("angular-select-bootstrap/dropdownMenu.tpl.html","<ul class=\"dropdown-menu\">\n    <li ng-repeat=\"item in items\" ng-class=\"{group: item.children.length, open: item.$$openned}\">\n        <a href=\"javascript:angular.noop()\" ng-click=\"dropdownSelectionCtrl.selectItem(item); $event.stopPropagation();\">\n            <span class=\"group icon\" ng-click=\"dropdownSelectionCtrl.openItem(item); $event.stopPropagation();\"></span>\n            <input type=\"checkbox\" ng-click=\"dropdownSelectionCtrl.selectItem(item); $event.stopPropagation();\" ng-if=\"dropdownSelectionCtrl.options.multiple\" ng-checked=\"dropdownSelectionCtrl.selectedItems.indexOf(item) != -1\">\n            <span class=\"glyphicon glyphicon-ok check-mark\" ng-if=\"!dropdownSelectionCtrl.options.multiple && dropdownSelectionCtrl.selectedItems.indexOf(item) != -1\"></span>\n            <span class=\"title\">{{ item.title || dropdownSelectionCtrl.options.placeholder }}</span>\n        </a>\n        <dropdown-menu ng-if=\"item.$$openned\" class=\"group\" parent=\"item\" items=\"item.children\"></dropdown-menu>\n    </li>\n</ul>");
$templateCache.put("angular-select-bootstrap/dropdownSelection.tpl.html","<div class=\"dropdown selection\" ng-class=\"{open: dropdownSelectionCtrl.oppened}\" click-outside=\"dropdownSelectionCtrl.close()\" click-outside-active=\"dropdownSelectionCtrl.oppened\" ng-switch=\"dropdownSelectionCtrl.mode\">\n    <button ng-switch-when=\"multiple\" class=\"btn btn-default dropdown-toggle\" type=\"button\" ng-click=\"dropdownSelectionCtrl.toggle()\" ng-switch=\"dropdownSelectionCtrl.selectedItems.length > dropdownSelectionCtrl.options.maxShow\">\n        \n        <span class=\"label label-default\" ng-switch-when=\"true\">\n            {{ dropdownSelectionCtrl.selectedItems.length }} {{ ::dropdownSelectionCtrl.options.maxTerm }}\n            <i class=\"remove glyphicon glyphicon-remove\" ng-click=\"dropdownSelectionCtrl.unselectAllItems()\"></i>\n        </span>\n        \n        <span class=\"label label-default\" ng-repeat=\"item in dropdownSelectionCtrl.selectedItems\" ng-switch-when=\"false\">\n            {{ ::item.title }}\n            <i class=\"remove glyphicon glyphicon-remove\" ng-click=\"dropdownSelectionCtrl.unselectItem(item)\"></i>\n        </span>\n        \n        <span class=\"caret\"></span>\n    </button>\n    \n    <label ng-switch-when=\"unique\" class=\"btn btn-default dropdown-toggle\" type=\"button\" ng-click=\"dropdownSelectionCtrl.toggle()\">\n        <span class=\"title\">{{ dropdownSelectionCtrl.selectedItems[0].title }}</span>\n        <span class=\"caret\"></span>\n    </label>\n    \n    <label ng-switch-when=\"unique-editable\" class=\"btn btn-default dropdown-toggle\" type=\"button\" ng-click=\"dropdownSelectionCtrl.toggle()\">\n        <input class=\"edit\" ng-if=\"dropdownSelectionCtrl.selectedItems[0]\" placeholder=\"{{ dropdownSelectionCtrl.options.placeholder }}\" ng-click=\"$event.stopPropagation()\" ng-model=\"dropdownSelectionCtrl.selectedItems[0].title\" type=\"text\"/>\n        <span class=\"caret\"></span>\n    </label>\n    \n    <dropdown-menu ng-if=\"dropdownSelectionCtrl.oppened\" items=\"dropdownSelectionCtrl.items\"></dropdown-menu>\n</div>");}]);