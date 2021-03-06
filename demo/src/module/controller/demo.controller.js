(function () {

    angular.module('angular-select-bootstrap-demo')
        .controller('DemoCtrl', Controller);

    function Controller(ITEMS, EASY_ITEMS) {

        this.items = ITEMS;
        this.items2 = EASY_ITEMS;

        this.value = [ITEMS[0]];
        this.value2 = [EASY_ITEMS[0].children[0].children[0], EASY_ITEMS[0].children[0].children[1]];

        this.value30 = ITEMS[1];

        this.addNewItemAndSelect = function() {
            var newItem = {id: 99, title: 'New Item'};
            this.items.push(newItem);
            this.value8 = newItem;
        }
        
        this.removeSelected = function() {
            var index = this.items.indexOf(this.value38);
            this.items.splice(index, 1);
            this.value38 = null;
        }
        
        this.onClose = function() {
            console.log('on close fn');
        }
        
        this.onOpen = function() {
            console.log('on open fn');
        }

        this.equalsFunction = function(item1, item2) {
            return item1.order == item2.order;
        }
        
    }

})();