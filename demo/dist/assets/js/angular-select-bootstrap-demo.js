(function() {
    'use strict'

    angular.module('angular-select-bootstrap-demo', [
        
        'angular-select-bootstrap', 
        'restfulNgMock', 
        'ngMockE2E' 

    ]);

})();

(function() {
    'use strict'

    angular.module('angular-select-bootstrap-demo')
        .constant('ITEMS', Constant());

    function Constant() {
        return [
          {
                    "id": 0,
                    "order": 0,
                    "title": "Option 1",
                    "children": [
                              {
                                        "id": 100,
                                        "order": 0,
                                        "title": "Option 1.1",
                                        "children": []
                              },
                              {
                                        "id": 200,
                                        "order": 1,
                                        "title": "Option 1.2",
                                        "children": [
                                                  {
                                                            "id": 1000,
                                                            "order": 0,
                                                            "title": "Option 1.2.1",
                                                            "children": []
                                                  },
                                                  {
                                                            "id": 1001,
                                                            "order": 1,
                                                            "title": "Option 1.2.2",
                                                            "children": []
                                                  }
                                        ]
                              }
                    ]
          },
          {
                    "id": 20,
                    "order": 1,
                    "title": "Option 2",
                    "children": []
          },
          {
                    "id": 30,
                    "order": 2,
                    "title": "Option 3",
                    "children": []
          }
];
    }

})();

(function () {

    Controller.$inject = ['ITEMS'];
    angular.module('angular-select-bootstrap-demo')
        .controller('DemoCtrl', Controller);

    function Controller(ITEMS) {
        
        this.items = ITEMS;

        this.value = [20];
        
    }

})();