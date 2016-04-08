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
        .constant('EASY_ITEMS', Constant());

    function Constant() {
        return [
          {
                    "classType": "com.easy.model.CanalDistribuicao",
                    "treeType": "canal",
                    "easyId": 1376256,
                    "title": "Campos Confecções",
                    "code": null,
                    "security": "{\"1566\":\"EDIT\",\"1567\":\"EDIT\"}",
                    "collapsed": true,
                    "parentEasyId": null,
                    "hide": false,
                    "message": null,
                    "order": 0,
                    "children": [
                              {
                                        "classType": "com.easy.model.CanalDistribuicao",
                                        "treeType": "canal",
                                        "easyId": 2621631,
                                        "title": "Distribuidores",
                                        "code": "03",
                                        "security": "{\"1566\":\"HIDE\",\"1567\":\"HIDE\"}",
                                        "collapsed": true,
                                        "parentEasyId": 1376256,
                                        "hide": false,
                                        "message": null,
                                        "order": 0,
                                        "children": [
                                                  {
                                                            "classType": "com.easy.model.CanalDistribuicao",
                                                            "treeType": "canal",
                                                            "easyId": 2621635,
                                                            "title": "Atacadistas",
                                                            "code": "03.01",
                                                            "security": "{\"1566\":\"HIDE\",\"1567\":\"HIDE\"}",
                                                            "collapsed": true,
                                                            "parentEasyId": 2621631,
                                                            "hide": false,
                                                            "message": null,
                                                            "order": 0,
                                                            "children": [],
                                                            "tooltip": {
                                                                      "Descrição": "Atacadistas",
                                                                      "Código": "03.01",
                                                                      "Segurança": "Edição"
                                                            },
                                                            "extraParam": null
                                                  },
                                                  {
                                                            "classType": "com.easy.model.CanalDistribuicao",
                                                            "treeType": "canal",
                                                            "easyId": 2621636,
                                                            "title": "Varejistas",
                                                            "code": "03.02",
                                                            "security": "{\"1566\":\"HIDE\",\"1567\":\"HIDE\"}",
                                                            "collapsed": true,
                                                            "parentEasyId": 2621631,
                                                            "hide": false,
                                                            "message": null,
                                                            "order": 0,
                                                            "children": [],
                                                            "tooltip": {
                                                                      "Descrição": "Varejistas",
                                                                      "Código": "03.02",
                                                                      "Segurança": "Edição"
                                                            },
                                                            "extraParam": null
                                                  }
                                        ],
                                        "tooltip": {
                                                  "Descrição": "Distribuidores",
                                                  "Código": "03",
                                                  "Segurança": "Edição"
                                        },
                                        "extraParam": null
                              },
                              {
                                        "classType": "com.easy.model.CanalDistribuicao",
                                        "treeType": "canal",
                                        "easyId": 1376258,
                                        "title": "Lojas Físicas",
                                        "code": "01",
                                        "security": "{\"888\":\"VIEW\",\"1566\":\"EDIT\",\"1567\":\"HIDE\"}",
                                        "collapsed": true,
                                        "parentEasyId": 1376256,
                                        "hide": false,
                                        "message": null,
                                        "order": 0,
                                        "children": [
                                                  {
                                                            "classType": "com.easy.model.CanalDistribuicao",
                                                            "treeType": "canal",
                                                            "easyId": 1376262,
                                                            "title": "Rio de Janeiro",
                                                            "code": "01.02",
                                                            "security": "{\"888\":\"VIEW\",\"1566\":\"EDIT\",\"1567\":\"HIDE\"}",
                                                            "collapsed": true,
                                                            "parentEasyId": 1376258,
                                                            "hide": false,
                                                            "message": null,
                                                            "order": 0,
                                                            "children": [
                                                                      {
                                                                                "classType": "com.easy.model.CanalDistribuicao",
                                                                                "treeType": "canal",
                                                                                "easyId": 1376263,
                                                                                "title": "Shopping Rio Sul",
                                                                                "code": "01.02.01",
                                                                                "security": "{\"888\":\"VIEW\",\"1566\":\"EDIT\",\"1567\":\"HIDE\"}",
                                                                                "collapsed": true,
                                                                                "parentEasyId": 1376262,
                                                                                "hide": false,
                                                                                "message": null,
                                                                                "order": 0,
                                                                                "children": [],
                                                                                "tooltip": {
                                                                                          "Descrição": "Shopping Rio Sul",
                                                                                          "Código": "01.02.01",
                                                                                          "Segurança": "Edição"
                                                                                },
                                                                                "extraParam": null
                                                                      }
                                                            ],
                                                            "tooltip": {
                                                                      "Descrição": "Rio de Janeiro",
                                                                      "Código": "01.02",
                                                                      "Segurança": "Edição"
                                                            },
                                                            "extraParam": null
                                                  },
                                                  {
                                                            "classType": "com.easy.model.CanalDistribuicao",
                                                            "treeType": "canal",
                                                            "easyId": 1933347,
                                                            "title": "Salvador",
                                                            "code": "01.03",
                                                            "security": "{\"888\":\"VIEW\",\"1566\":\"EDIT\",\"1567\":\"HIDE\"}",
                                                            "collapsed": true,
                                                            "parentEasyId": 1376258,
                                                            "hide": false,
                                                            "message": null,
                                                            "order": 0,
                                                            "children": [
                                                                      {
                                                                                "classType": "com.easy.model.CanalDistribuicao",
                                                                                "treeType": "canal",
                                                                                "easyId": 1933348,
                                                                                "title": "Shopping Iguatemi",
                                                                                "code": "01.03.01",
                                                                                "security": "{\"888\":\"VIEW\",\"1566\":\"EDIT\",\"1567\":\"HIDE\"}",
                                                                                "collapsed": true,
                                                                                "parentEasyId": 1933347,
                                                                                "hide": false,
                                                                                "message": null,
                                                                                "order": 0,
                                                                                "children": [],
                                                                                "tooltip": {
                                                                                          "Descrição": "Shopping Iguatemi",
                                                                                          "Código": "01.03.01",
                                                                                          "Segurança": "Edição"
                                                                                },
                                                                                "extraParam": null
                                                                      }
                                                            ],
                                                            "tooltip": {
                                                                      "Descrição": "Salvador",
                                                                      "Código": "01.03",
                                                                      "Segurança": "Edição"
                                                            },
                                                            "extraParam": null
                                                  },
                                                  {
                                                            "classType": "com.easy.model.CanalDistribuicao",
                                                            "treeType": "canal",
                                                            "easyId": 1376259,
                                                            "title": "São Paulo",
                                                            "code": "01.01",
                                                            "security": "{\"888\":\"VIEW\",\"1566\":\"EDIT\",\"1567\":\"HIDE\"}",
                                                            "collapsed": true,
                                                            "parentEasyId": 1376258,
                                                            "hide": false,
                                                            "message": null,
                                                            "order": 0,
                                                            "children": [
                                                                      {
                                                                                "classType": "com.easy.model.CanalDistribuicao",
                                                                                "treeType": "canal",
                                                                                "easyId": 1376260,
                                                                                "title": "Shopping Moema",
                                                                                "code": "01.01.01",
                                                                                "security": "{\"888\":\"VIEW\",\"1566\":\"EDIT\",\"1567\":\"HIDE\"}",
                                                                                "collapsed": true,
                                                                                "parentEasyId": 1376259,
                                                                                "hide": false,
                                                                                "message": null,
                                                                                "order": 0,
                                                                                "children": [],
                                                                                "tooltip": {
                                                                                          "Descrição": "Shopping Moema",
                                                                                          "Código": "01.01.01",
                                                                                          "Segurança": "Edição"
                                                                                },
                                                                                "extraParam": null
                                                                      },
                                                                      {
                                                                                "classType": "com.easy.model.CanalDistribuicao",
                                                                                "treeType": "canal",
                                                                                "easyId": 1376261,
                                                                                "title": "Shopping Morumbi",
                                                                                "code": "01.01.02",
                                                                                "security": "{\"888\":\"VIEW\",\"1566\":\"EDIT\",\"1567\":\"HIDE\"}",
                                                                                "collapsed": true,
                                                                                "parentEasyId": 1376259,
                                                                                "hide": false,
                                                                                "message": null,
                                                                                "order": 0,
                                                                                "children": [],
                                                                                "tooltip": {
                                                                                          "Descrição": "Shopping Morumbi",
                                                                                          "Código": "01.01.02",
                                                                                          "Segurança": "Edição"
                                                                                },
                                                                                "extraParam": null
                                                                      }
                                                            ],
                                                            "tooltip": {
                                                                      "Descrição": "São Paulo",
                                                                      "Código": "01.01",
                                                                      "Segurança": "Edição"
                                                            },
                                                            "extraParam": null
                                                  }
                                        ],
                                        "tooltip": {
                                                  "Descrição": "Lojas Físicas",
                                                  "Código": "01",
                                                  "Segurança": "Edição"
                                        },
                                        "extraParam": null
                              },
                              {
                                        "classType": "com.easy.model.CanalDistribuicao",
                                        "treeType": "canal",
                                        "easyId": 1376264,
                                        "title": "Lojas Virtuais",
                                        "code": "02",
                                        "security": "{\"888\":\"HIDE\",\"1566\":\"HIDE\",\"1567\":\"EDIT\"}",
                                        "collapsed": true,
                                        "parentEasyId": 1376256,
                                        "hide": false,
                                        "message": null,
                                        "order": 0,
                                        "children": [
                                                  {
                                                            "classType": "com.easy.model.CanalDistribuicao",
                                                            "treeType": "canal",
                                                            "easyId": 1376265,
                                                            "title": "Like Store",
                                                            "code": "02.01",
                                                            "security": "{\"888\":\"HIDE\",\"1566\":\"HIDE\",\"1567\":\"EDIT\"}",
                                                            "collapsed": true,
                                                            "parentEasyId": 1376264,
                                                            "hide": false,
                                                            "message": null,
                                                            "order": 0,
                                                            "children": [],
                                                            "tooltip": {
                                                                      "Descrição": "Like Store",
                                                                      "Código": "02.01",
                                                                      "Segurança": "Edição"
                                                            },
                                                            "extraParam": null
                                                  },
                                                  {
                                                            "classType": "com.easy.model.CanalDistribuicao",
                                                            "treeType": "canal",
                                                            "easyId": 1376266,
                                                            "title": "Mercado Livre",
                                                            "code": "02.02",
                                                            "security": "{\"888\":\"HIDE\",\"1566\":\"HIDE\",\"1567\":\"EDIT\"}",
                                                            "collapsed": true,
                                                            "parentEasyId": 1376264,
                                                            "hide": false,
                                                            "message": null,
                                                            "order": 0,
                                                            "children": [],
                                                            "tooltip": {
                                                                      "Descrição": "Mercado Livre",
                                                                      "Código": "02.02",
                                                                      "Segurança": "Edição"
                                                            },
                                                            "extraParam": null
                                                  },
                                                  {
                                                            "classType": "com.easy.model.CanalDistribuicao",
                                                            "treeType": "canal",
                                                            "easyId": 1376267,
                                                            "title": "Site Próprio",
                                                            "code": "02.03",
                                                            "security": "{\"888\":\"HIDE\",\"1566\":\"HIDE\",\"1567\":\"EDIT\"}",
                                                            "collapsed": true,
                                                            "parentEasyId": 1376264,
                                                            "hide": false,
                                                            "message": null,
                                                            "order": 0,
                                                            "children": [],
                                                            "tooltip": {
                                                                      "Descrição": "Site Próprio",
                                                                      "Código": "02.03",
                                                                      "Segurança": "Edição"
                                                            },
                                                            "extraParam": null
                                                  }
                                        ],
                                        "tooltip": {
                                                  "Descrição": "Lojas Virtuais",
                                                  "Código": "02",
                                                  "Segurança": "Edição"
                                        },
                                        "extraParam": null
                              },
                              {
                                        "classType": "com.easy.model.CanalDistribuicao",
                                        "treeType": "canal",
                                        "easyId": 2621632,
                                        "title": "Representantes",
                                        "code": "04",
                                        "security": "{\"888\":\"HIDE\",\"1566\":\"HIDE\",\"1567\":\"HIDE\"}",
                                        "collapsed": true,
                                        "parentEasyId": 1376256,
                                        "hide": false,
                                        "message": null,
                                        "order": 0,
                                        "children": [
                                                  {
                                                            "classType": "com.easy.model.CanalDistribuicao",
                                                            "treeType": "canal",
                                                            "easyId": 8880165,
                                                            "title": "Norte",
                                                            "code": "04.03",
                                                            "security": null,
                                                            "collapsed": true,
                                                            "parentEasyId": 2621632,
                                                            "hide": false,
                                                            "message": null,
                                                            "order": 0,
                                                            "children": [],
                                                            "tooltip": {
                                                                      "Descrição": "Norte",
                                                                      "Código": "04.03",
                                                                      "Segurança": "Edição"
                                                            },
                                                            "extraParam": null
                                                  },
                                                  {
                                                            "classType": "com.easy.model.CanalDistribuicao",
                                                            "treeType": "canal",
                                                            "easyId": 2621634,
                                                            "title": "Sudeste",
                                                            "code": "04.02",
                                                            "security": "{\"888\":\"HIDE\",\"1566\":\"HIDE\",\"1567\":\"HIDE\"}",
                                                            "collapsed": true,
                                                            "parentEasyId": 2621632,
                                                            "hide": false,
                                                            "message": null,
                                                            "order": 0,
                                                            "children": [],
                                                            "tooltip": {
                                                                      "Descrição": "Sudeste",
                                                                      "Código": "04.02",
                                                                      "Segurança": "Edição"
                                                            },
                                                            "extraParam": null
                                                  },
                                                  {
                                                            "classType": "com.easy.model.CanalDistribuicao",
                                                            "treeType": "canal",
                                                            "easyId": 2621633,
                                                            "title": "Sul",
                                                            "code": "04.01",
                                                            "security": "{\"888\":\"HIDE\",\"1566\":\"HIDE\",\"1567\":\"HIDE\"}",
                                                            "collapsed": true,
                                                            "parentEasyId": 2621632,
                                                            "hide": false,
                                                            "message": null,
                                                            "order": 0,
                                                            "children": [],
                                                            "tooltip": {
                                                                      "Descrição": "Sul",
                                                                      "Código": "04.01",
                                                                      "Segurança": "Edição"
                                                            },
                                                            "extraParam": null
                                                  }
                                        ],
                                        "tooltip": {
                                                  "Descrição": "Representantes",
                                                  "Código": "04",
                                                  "Segurança": "Edição"
                                        },
                                        "extraParam": null
                              }
                    ],
                    "tooltip": {
                              "Descrição": null,
                              "Código": null,
                              "Segurança": "Edição"
                    },
                    "extraParam": null
          }
];
    }

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

    Controller.$inject = ['ITEMS', 'EASY_ITEMS'];
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
        
    }

})();