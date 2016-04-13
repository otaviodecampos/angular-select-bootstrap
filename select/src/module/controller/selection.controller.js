(function () {

    angular.module('angular-select-bootstrap')
        .controller('DropdownSelectionCtrl', Controller);

    /* @ngInject */
    function Controller($scope, $document, $element) {

        var that = this;
        this.oppened = false;
        this.selectedItems = [];

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

        this.contains = function(item) {
            var contains = false;
            
            for(var i = 0; i < this.selectedItems.length; i++) {
                var selectedItem = this.selectedItems[i];
                
                if(angular.isObject(selectedItem)) {
                    contains = selectedItem[that.options.idProperty] == item[that.options.idProperty];
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
                    if(modelItem[that.options.idProperty] == item[that.options.idProperty]) {
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

        
        var initModelItem = function(item, parent) {
            initItem(item, parent);
            angular.forEach(item.children, function(children) {
                initModelItem(children, item);
            });
        }
        
        var initItems = function(items) {
            angular.forEach(items, function(item) {
                initModelItem(item);
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