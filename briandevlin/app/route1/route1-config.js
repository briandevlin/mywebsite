(function () {
    'use strict';

    angular
        .module('app.route1')
        .run(
          ['$rootScope', '$state', '$stateParams',
            function ($rootScope, $state, $stateParams) {
                console.log('module: app.route1 running ');

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
                onEnter: function () {
                    console.log('onEnter abstract')
                },
                onExit: function () {
                    console.log('onExit  abstract')
                },

                // Note: abstract still needs a ui-view for its children to populate.
                // You can simply add it inline here.
                template: '<ui-view/>'
            })
         .state('state.state1', {
             url: "/state1",
             //You can attach custom data to the state object and retrieve using: $state.current.data.customDataHello
             data: {
                 customDataHello: "Hello",
                 customDataWorld: "World!"
             },
             //You can use resolve to provide your controller with content or data that is custom to the state. 
            // resolve is an optional map of dependencies which should be injected into the controller.
             resolve: {
                 resource1: function () {
                     return { 'value': 'Resolved resource1' };
                 }
             },
             // The callbacks also have access to all the resolved dependencies.
             onEnter: function (resource1) {
                 console.log('onEnter state.state1 ' + resource1.value)
             },
             onExit: function (resource1) {
                 console.log('onExit  state.state1 ' + resource1.value)
             },
             templateUrl: "app/route1/route1.html",
             controllerAs: 'route1Crtl',
             controller: 'route1Controller'
         })
        .state('state.state1.alist', {
            url: "/alist",
            onEnter: function (resource1) {
                console.log('onEnter state.state1.alist ' + resource1.value)
            },
            onExit: function (resource1) {
                console.log('onExit state.state1.alist ' + resource1.value)
            },
            templateUrl: "app/route1/route1.list.html",
            //controllerAs: 'route1Crtl',
            //controller: 'route1Controller'
        })
           .state('state.state1.detail', {
               url: "/detail/:item",
               onEnter: function (resource1) {
                   console.log('onEnter state.state1.detail ' + resource1.value)
               },
               onExit: function (resource1) {
                   console.log('onExit state.state1.detail ' + resource1.value)
               },
               templateUrl: "app/route1/route1-list-detail.html",
              
               controllerAs: 'routeDetailCrtl',
               controller: ['$scope', '$stateParams',
                       function ($scope, $stateParams) {
                           var vm = this;
                            vm.contactId = $stateParams.item;
                           //vm.contactId = '111';
                           //vm.contact = $scope.$parent.welcome.contacts[$stateParams.contactId - 1];
                       }]
           })


    }


})();