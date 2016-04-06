(function () {

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