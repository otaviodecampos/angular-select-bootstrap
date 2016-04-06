(function () {

    angular.module('angular-select-bootstrap-demo')
        .controller('DemoCtrl', Controller);

    function Controller(ITEMS) {
        
        this.items = ITEMS;

        this.value = [20];
        
    }

})();