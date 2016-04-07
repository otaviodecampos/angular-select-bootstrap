(function () {

    angular.module('angular-select-bootstrap-demo')
        .controller('DemoCtrl', Controller);

    function Controller(ITEMS, EASY_ITEMS) {

        this.items = ITEMS;
        this.items2 = EASY_ITEMS;

        this.value = [ITEMS[0]];
        this.value2 = [EASY_ITEMS[0]];
        
    }

})();