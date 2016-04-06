(function () {

    angular.module('angular-select-bootstrap-demo')
        .controller('DemoCtrl', Controller);

    function Controller(ITEMS, EASY_ITEMS) {

        this.items = ITEMS;
        this.items2 = EASY_ITEMS;

        this.value = [1000, 1001, 100];
        this.value2 = [2621631,2621635,2621636];
        
    }

})();