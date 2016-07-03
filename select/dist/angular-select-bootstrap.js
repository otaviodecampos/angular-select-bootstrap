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
        that.oppened = false;
        that.selectedItems = [];

        var addSelectedItem = function(item) {
            item.$$selected = true;
            if(that.options.multiple) {
                if(item.children == false) {
                    if(that.selectedItems.indexOf(item) == -1) {
                        var model = that.getModel();
                        that.selectedItems.push(item);
                        model.push(item);
                    }
                }
            } else {
                if(that.selectedItems.indexOf(item) == -1) {
                    that.selectedItems.push(item);
                }
                that.setModelValue(item);
            }
        }

        var removeSelectedItem = function(item) {
            if(item) {
                item.$$selected = false;
                if(that.options.multiple) {
                    if(item.children == false) {
                        var index = that.selectedItems.indexOf(item);
                        if (index != -1) {
                            var model = that.getModel();
                            model.splice(index, 1);
                            that.selectedItems.splice(index, 1);
                        }
                    }
                } else {
                    var index = that.selectedItems.indexOf(item);
                    if(index != -1) {
                        that.selectedItems.splice(index, 1);
                    }
                    that.setModelValue(null);
                }
            }
        }

        var selectAllChildren = function(item) {
            angular.forEach(item.children, function(item) {
                addSelectedItem(item);
                selectAllChildren(item);
            });
        }

        var unselectAllChildren = function(item) {
            angular.forEach(item.children, function(item) {
                removeSelectedItem(item);
                unselectAllChildren(item);
            });
        }

        var toShow = function(term, item, recursive) {
            var show = false;

            if(recursive == undefined) {
                recursive = true;
            }

            if(item.title && item.title.replace(/[^\w\s+]/gi, '').toLowerCase().indexOf(term.toLowerCase().replace(/[^\w\s+]/gi, '')) != -1) {
                show = true;
            }

            if(item.children) {
                for(var i = 0; i < item.children.length; i++) {
                    var child = item.children[i];
                    var showChild = toShow(term, child, false);

                    if(!showChild) {
                        item.$$openned = false;
                    }

                    if(!show && showChild) {
                        show = true;
                    }
                    if(show) {
                        break;
                    }
                }
            }

            if(show && item.$$parent) {
                item.$$parent.$$openned = true;
            }

            return show;
        }

        that.searchFilter = function(item, index, itens) {
            var search = that.searchTerm && that.searchTerm.title || false;
            var show = true;

            if(search) {
                show = toShow(search, item);
            } else {
                item.$$openned = item.$$lastOpennedState;
            }

            return show;
        }

        this.equalItems = function(item1, item2) {
            var fn = that.equalsFunction();
            if(fn) {
                return fn(item1, item2);
            } else {
                return item1[that.options.idProperty] == item2[that.options.idProperty];
            }

        }

        this.contains = function(item) {
            var contains = false;

            for(var i = 0; i < this.selectedItems.length; i++) {
                var selectedItem = this.selectedItems[i];

                if(angular.isObject(selectedItem)) {
                    contains = that.equalItems(item, selectedItem);
                } else {
                    contains = selectedItem == item;
                }

                if(contains) {
                    break;
                }
            }

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

                var openFn = that.onOpen();
                if(openFn) {
                    openFn();
                }
            } else {
                var closeFn = that.onClose();
                if(closeFn) {
                    closeFn();
                }
            }
        }

        this.close = function() {
            if(this.oppened) {
                this.oppened = false;
                $document.unbind('click', onClick);
                var closeFn = that.onClose();
                if(closeFn) {
                    closeFn();
                }
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

        this.openAll = function(items) {
            for(var i = 0; i < items.length; i++) {
                var item = items[i];
                if(item.children) {
                    item.$$lastOpennedState = true;
                    item.$$openned = true;
                    this.openAll(item.children);
                }
            }
        }

        this.closeAll = function(items) {
            for(var i = 0; i < items.length; i++) {
                var item = items[i];
                if(item.children) {
                    item.$$lastOpennedState = false;
                    item.$$openned = false;
                    this.closeAll(item.children);
                }
            }
        }

        this.selectItem = function(item, cascade) {
            var model = this.getModel();

            if(cascade == undefined) {
                cascade = true;
            }

            if(this.options.multiple && item.$$checkbox) {
                if(item.$$checkbox.prop('checked')) {
                    if(cascade) {
                        selectAllChildren(item);
                    }
                    addSelectedItem(item);
                } else {
                    removeSelectedItem(item);
                    if(cascade) {
                        unselectAllChildren(item);
                    }
                }
            } else {
                this.unselectAllItems();

                if(angular.equals(model, item)) {
                    removeSelectedItem(item);
                } else {
                    addSelectedItem(item);
                }

            }

            if(this.options.selectClose) {
                this.close();
            }
        }

        this.openItem = function(item, openParent, forceState, byClick) {
            if(item && item.children != undefined) {
                item.$$openned = forceState != undefined ? forceState : !item.$$openned;

                item.$$lastOpennedState = item.$$openned;

                if(item.$$openned) {
                    item.$$opennedByClick = byClick != undefined ? byClick : true;
                } else {
                    delete item.$$opennedByClick;
                }

                if(openParent) {
                    this.openItem(item.$$parent, true);
                }
            }
        }

        this.unselectItem = function(item) {
            this.selectItem(this.options.multiple && item || null, false);
        }

        this.unselectAllItems = function() {
            if(this.options.multiple) {
                var model = this.getModel();
                model.length = 0;
            }

            for(var i = 0; i < this.selectedItems.length; i++) {
                var selectedItem = this.selectedItems[0];
                selectedItem.$$selected = false;
            }
            this.selectedItems.length = 0;
        }

        var initItem = function(item, parent) {
            item.$$parent = parent;

            if(angular.isObject(item)) {
                item.$$isObject = true;
            }

            var model = that.getModel()
                , selected = false;

            if(that.options.multiple && model) {
                angular.forEach(model, function(modelItem) {
                    if(that.equalItems(modelItem, item)) {
                        selected = true;
                        return false;
                    }
                });
            }

            if(model == item || selected) {
                that.openItem(parent, true, true, false);
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


        var initModelItem = function(item, parent, open) {
            initItem(item, parent);
            angular.forEach(item.children, function(children) {
                initModelItem(children, item);
                if(open) {
                    that.openItem(item, false, true);
                }
            });
        }

        var initItems = function(items) {
            angular.forEach(items, function(item) {
                initModelItem(item, null, that.options.preOpenFirstChild);
            });
        }

        var init = $scope.$watch('dropdownSelectionCtrl.items', function(items) {
            if(items) {
                initItems(items);
                init();
            }
        });

    }

})();
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
                items: "=",
                onClose: "&",
                onOpen: "&",
                equalsFunction: "&"
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
                    selectClose: false,
                    preOpenFirstChild: false,
                    searchPlaceholder: 'Filtrar'
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
(function() {
    'use strict'

    Filter.$inject = ['$sce'];
    angular.module('angular-select-bootstrap')
        .filter('dropdownHighlight', Filter);

    function Filter($sce) {
        return function(text, search) {
            if (!search) {
                return $sce.trustAsHtml(text);
            }
            try {
                var reg = new RegExp(search, 'gi');
            } catch(e) {
                reg = new RegExp();
            }


            return $sce.trustAsHtml(text.replace(reg, '<span class="dropdown-highlighted">$&</span>'));
        }
    }

})();
(function() {
    'use strict'

    angular.module('angular-select-bootstrap')
        .filter('noop', Filter);

    function Filter() {
        return function(text) {
            return text;
        }
    }

})();
angular.module("angular-select-bootstrap").run(["$templateCache", function($templateCache) {$templateCache.put("angular-select-bootstrap/dropdownMenu.tpl.html","<ul class=\"dropdown-menu\">\r\n    <li ng-repeat=\"item in items | filter:dropdownSelectionCtrl.searchFilter\" ng-class=\"{\'dropdown-group\': item.children.length, open: item.$$openned}\">\r\n        <a href=\"javascript:angular.noop()\" ng-click=\"dropdownSelectionCtrl.selectItem(item); $event.stopPropagation()\">\r\n            <span class=\"dropdown-group icon\" ng-click=\"dropdownSelectionCtrl.openItem(item); $event.stopPropagation()\"></span>\r\n            <input type=\"checkbox\" dropdown-indeterminate=\"item\" ng-click=\"dropdownSelectionCtrl.selectItem(item); $event.stopPropagation()\" ng-if=\"dropdownSelectionCtrl.options.multiple\" ng-checked=\"item.$$selected\">\r\n            <span class=\"glyphicon glyphicon-ok check-mark\" ng-if=\"!dropdownSelectionCtrl.options.multiple && item.$$selected\"></span>\r\n            <span class=\"dropdown-title\" ng-bind-html=\"(item.$$isObject ? item.title : item) || dropdownSelectionCtrl.options.placeholder | dropdownHighlight:dropdownSelectionCtrl.searchTerm.title\"></span><!--{{ dropdownSelectionCtrl.options.filter ? dropdownSelectionCtrl.options.filter : \'noop\' }}-->\r\n        </a>\r\n        <dropdown-menu ng-if=\"item.$$openned\" class=\"dropdown-group\" parent=\"item\" items=\"item.children\"></dropdown-menu>\r\n    </li>\r\n</ul>");
$templateCache.put("angular-select-bootstrap/dropdownSelection.tpl.html","<div class=\"dropdown selection\" ng-class=\"{open: dropdownSelectionCtrl.oppened}\" click-outside=\"dropdownSelectionCtrl.close()\" click-outside-active=\"dropdownSelectionCtrl.oppened\" ng-switch=\"dropdownSelectionCtrl.mode\">\r\n    <button ng-switch-when=\"multiple\" class=\"btn btn-default dropdown-toggle\" type=\"button\" ng-click=\"dropdownSelectionCtrl.toggle()\" ng-switch=\"dropdownSelectionCtrl.selectedItems.length > dropdownSelectionCtrl.options.maxShow\">\r\n        \r\n        <span class=\"label label-default\" ng-switch-when=\"true\">\r\n            {{ dropdownSelectionCtrl.selectedItems.length }} {{ ::dropdownSelectionCtrl.options.maxTerm }}\r\n            <i class=\"remove glyphicon glyphicon-remove\" ng-click=\"dropdownSelectionCtrl.unselectAllItems()\"></i>\r\n        </span>\r\n        \r\n        <span class=\"label label-default\" ng-repeat=\"item in dropdownSelectionCtrl.selectedItems\" ng-switch-when=\"false\">\r\n            <span ng-bind=\"::( item.$$isObject && item.title || item ) | {{ dropdownSelectionCtrl.options.filter ? dropdownSelectionCtrl.options.filter : \'noop\' }}\"></span>\r\n            <i class=\"remove glyphicon glyphicon-remove\" ng-click=\"dropdownSelectionCtrl.unselectItem(item)\"></i>\r\n        </span>\r\n        \r\n        <span class=\"caret\"></span>\r\n    </button>\r\n    \r\n    <label ng-switch-when=\"unique\" class=\"btn btn-default dropdown-toggle\" type=\"button\" ng-click=\"dropdownSelectionCtrl.toggle()\">\r\n        <span class=\"dropdown-title\" ng-bind=\"( dropdownSelectionCtrl.selectedItems[0].$$isObject && dropdownSelectionCtrl.selectedItems[0].title || dropdownSelectionCtrl.selectedItems[0] ) || dropdownSelectionCtrl.options.title | {{ dropdownSelectionCtrl.options.filter ? dropdownSelectionCtrl.options.filter : \'noop\' }}\"></span>\r\n        <span class=\"caret\"></span>\r\n    </label>\r\n    \r\n    <label ng-switch-when=\"unique-editable\" class=\"btn btn-default dropdown-toggle\" type=\"button\" ng-click=\"dropdownSelectionCtrl.toggle()\">\r\n        <input class=\"edit\" ng-if=\"dropdownSelectionCtrl.selectedItems[0]\" placeholder=\"{{ dropdownSelectionCtrl.options.placeholder }}\" ng-click=\"$event.stopPropagation()\" ng-model=\"dropdownSelectionCtrl.selectedItems[0].title\" type=\"text\"/>\r\n        <span class=\"caret\"></span>\r\n    </label>\r\n\r\n    <div class=\"dropdown-control\" ng-if=\"dropdownSelectionCtrl.oppened && (dropdownSelectionCtrl.options.search || dropdownSelectionCtrl.options.buttons)\">\r\n        <div class=\"dropdown-search\" ng-if=\"::dropdownSelectionCtrl.options.search\">\r\n            <input type=\"text\" class=\"form-control\" placeholder=\"{{ dropdownSelectionCtrl.options.searchPlaceholder }}\" ng-model=\"dropdownSelectionCtrl.searchTerm.title\" ng-model-options=\"{debounce: 300}\" autocomplete=\"off\">\r\n        </div>\r\n\r\n        <div class=\"dropdown-buttons\" ng-if=\"::dropdownSelectionCtrl.options.buttons\">\r\n            <span class=\"label label-default\" ng-click=\"dropdownSelectionCtrl.openAll(dropdownSelectionCtrl.items)\">\r\n                <i class=\"fa fa-plus\"></i>\r\n            </span>\r\n\r\n            <span class=\"label label-default\" ng-click=\"dropdownSelectionCtrl.closeAll(dropdownSelectionCtrl.items)\">\r\n                <i class=\"fa fa-minus\"></i>\r\n            </span>\r\n        </div>\r\n    </div>\r\n\r\n    <dropdown-menu ng-if=\"dropdownSelectionCtrl.oppened\" items=\"dropdownSelectionCtrl.items\"></dropdown-menu>\r\n</div>");}]);