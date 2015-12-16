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
        .state('state.state1.alist', {        
            url: "/alist",
            templateUrl: "app/route1/route1.list.html",
            controllerAs: 'route1Crtl',
            controller: 'route1Controller'          
        })


    }


})();