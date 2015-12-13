(function () {
    'use strict';

    angular
        .module('app.route1')
        .run(
          ['$rootScope', '$state', '$stateParams',
            function ($rootScope, $state, $stateParams) {


            }
          ]
        )
        .config(route1Config);

    route1Config.$inject = ['$stateProvider'];

    function route1Config($stateProvider) {

        $stateProvider
            .state('state', {
                abstract: true,
                url: '/state',

                // Note: abstract still needs a ui-view for its children to populate.
                // You can simply add it inline here.
                template: '<ui-view/>'
            })
         .state('state.state1', {
             url: "/state1",
             data: {
                 customDataHello: "Hello",
                 customDataWorld: "World!"
             },
             resolve: {
                 resource1: function () {
                     return { 'value': 'resource1' };
                 }
             },
             templateUrl: "app/route1/route1.html"
         })
        .state('state.state1.list', {
           // parent: 'state1',
            url: "/list",
            templateUrl: "app/route1/route1.list.html",
            controllerAs: 'vm',
            controller: 'route1Controller'
            //controller: ['resource1', function (resource1) {
            //    var vm = this;
            //    vm.resource = resource1.value;

            //    vm.items = ["A", "List", "Of", "Items"];
            //}]
        })


    }


})();