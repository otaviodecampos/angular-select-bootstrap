(function () {

    angular.module('angular-select-bootstrap-demo')
        .controller('DemoCtrl', Controller);

    function Controller(ITEMS, EASY_ITEMS) {

        this.items = ITEMS;
        this.items2 = EASY_ITEMS;

        this.value = [ITEMS[0]];
        this.value2 = [EASY_ITEMS[0]];
        
        this.addNewItemAndSelect = function() {
            var newItem = {id: 99, title: 'New Item'};
            this.items.push(newItem);
            this.value8 = newItem;
        }
        
        this.removeSelected = function() {
            var index = this.items.indexOf(this.value9);
            this.items.splice(index, 1);
            this.value9 = null;
        }
        
        this.onClose = function() {
            console.log(9);
        }
        
    }

})();