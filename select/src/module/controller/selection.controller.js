(function () {

    angular.module('angular-select-bootstrap')
        .controller('DropdownSelectionCtrl', Controller);

    /* @ngInject */
    function Controller($scope, $document, $element) {

        var that = this;
        that.oppened = false;
        that.selectedItems = [];

        var addSelectedItem = function(item) {
            if(that.selectedItems.indexOf(item) == -1) {
                item.$$selected = true;
                that.selectedItems.push(item);
            }
        }

        var removeSelectedItem = function(item) {
            var index = that.selectedItems.indexOf(item);
            if(index != -1) {
                that.selectedItems.splice(index, 1);
                item.$$selected = false;   
            }
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
                this.oppened = false
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
                if(that.options.selectToggle && angular.equals(model, item)) {
                    item = null;
                }
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
        
        this.openItem = function(item, openParent) {
            if(item && item.children != undefined) {
                item.$$openned = !item.$$openned;
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
                that.openItem(parent, true);
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
                    item.$$openned = true;
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