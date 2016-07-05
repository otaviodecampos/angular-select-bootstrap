(function () {

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
                        if(indexOfComparator(model, item) == -1) {
                            model.push(item);
                        }
                    }
                }
            } else {
                if(that.selectedItems.indexOf(item) == -1) {
                    that.selectedItems.push(item);
                }
                that.setModelValue(item);
            }
        }

        var indexOfComparator = function(array, obj) {
            var index = -1;
            if(array) {
                for(var i = 0; i < array.length; i ++) {
                    var arrayObj = array[i];
                    if(that.equalItems(arrayObj, obj)) {
                        index = i;
                        break;
                    };
                }
            }
            return index;
        }

        var removeSelectedItem = function(item) {
            if(item) {
                item.$$selected = false;
                if(that.options.multiple) {
                    if(item.children == false) {
                        var index = that.selectedItems.indexOf(item);
                        if (index != -1) {
                            var model = that.getModel();
                            var modelIndex = indexOfComparator(model, item);
                            if(modelIndex != -1) {
                                model.splice(modelIndex, 1);
                            }
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
            if(item) {
                angular.forEach(item.children, function(item) {
                    removeSelectedItem(item);
                    unselectAllChildren(item);
                });
            }
        }

        var unselectAllParent = function(item) {
            if(item) {
                removeSelectedItem(item.$$parent);
                unselectAllChildren(item.$$parent);
                unselectAllParent(item.$$parent);
            }
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
                if(angular.equals(model, item)) {
                    if(that.options.selectToggle) {
                        removeSelectedItem(item);
                    }
                } else {
                    this.unselectAllItems();
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
            removeSelectedItem(item);
        }

        this.unselectAllItems = function() {
            if(this.options.multiple) {
                var model = this.getModel();
                model.length = 0;
            }

            for(var i = 0; i < this.selectedItems.length; i++) {
                var selectedItem = this.selectedItems[i];
                removeSelectedItem(selectedItem);
                unselectAllParent(selectedItem);
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

        that.initItems = function(items) {
            that.items = items;
            angular.forEach(items, function(item) {
                initModelItem(item, null, that.options.preOpenFirstChild);
            });
        }

    }

})();