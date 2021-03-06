﻿(function () {
    'use strict';

    angular
        .module('app.welcome', [
            'ui.router'
        ])
    .run(
          ['$rootScope', '$state', '$stateParams',
            function ($rootScope, $state, $stateParams) {
                console.log('module: app.welcome running ');

            }
          ]
        )
    .config(
    ['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        console.info('in app.welcome.config');

        $stateProvider

                   .state('state.welcome', {
                       data: {
                           customData1: "Hello",
                           customData2: "World!"
                       },
                       //onEnter: function (resA) {
                       //    console.info('onEnter: ' + resA);
                       //},
                       //onExit: function (resA) {
                       //    console.info('onExit: ' + resA);
                       //},
                       resolve: {
                           // Example using function with simple return value.
                           // Since it's not a promise, it resolves immediately.               
                           resA: function () {
                               return { 'value': ' Inherited value' };
                           },
                           //Example showing returning of custom made promise

                           greeting: ['$q', '$timeout', function ($q, $timeout) {
                               var deferred = $q.defer();
                               $timeout(function () {
                                   deferred.resolve('Hello!');
                               }, 1000);
                               return deferred.promise;
                           }],
                           // Another promise example. If you need to do some 
                           // processing of the result, use .then, and your 
                           // promise is chained in for free. This is another
                           // typical use case of resolve.
                           //promiseObj2: function ($http) {
                           //    return $http({ method: 'GET', url: '#/route1' })
                           //       .then(function (data) {
                           //           //return doSomeStuffFirst(data);
                           //           return data;
                           //       });
                           //}
                       },
                       url: "/welcome",
                       templateUrl: "app/welcome/welcome.html",
                       controllerAs: 'welcome',
                       controller: 'welcome-controller'
                   })

        /////////////////////
        // Contacts > List //
        /////////////////////


        // Using a '.' within a state name declares a child within a parent.
        // So you have a new state 'list' within the parent 'welcome' state.
        .state('state.welcome.list', {
            // parent: 'welcome',
            // Using an empty url means that this child state will become active
            // when its parent's url is navigated to. Urls of child states are
            // automatically appended to the urls of their parent. So this state's
            // url is '/welcome' (because '/welcome' + '').
            url: '',

            // IMPORTANT: Now we have a state that is not a top level state. Its
            // template will be inserted into the ui-view within this state's
            // parent's template; so the ui-view within contacts.html. This is the
            // most important thing to remember about templates.
            templateUrl: 'app/welcome/contacts.list.html'
        })

        ///////////////////////
        // Contacts > Detail //
        ///////////////////////

        // You can have unlimited children within a state. Here is a second child
        // state within the 'contacts' parent state.
        .state('state.welcome.detail', {

            // Urls can have parameters. They can be specified like :param or {param}.
            // If {} is used, then you can also specify a regex pattern that the param
            // must match. The regex is written after a colon (:). Note: Don't use capture
            // groups in your regex patterns, because the whole regex is wrapped again
            // behind the scenes. Our pattern below will only match numbers with a length
            // between 1 and 4.

            // Since this state is also a child of 'contacts' its url is appended as well.
            // So its url will end up being '/contacts/{contactId:[0-9]{1,4}}'. When the
            // url becomes something like '/contacts/42' then this state becomes active
            // and the $stateParams object becomes { contactId: 42 }.
            url: '/{contactId:[0-9]{1,4}}',

            // If there is more than a single ui-view in the parent template, or you would
            // like to target a ui-view from even higher up the state tree, you can use the
            // views object to configure multiple views. Each view can get its own template,
            // controller, and resolve data.

            // View names can be relative or absolute. Relative view names do not use an '@'
            // symbol. They always refer to views within this state's parent template.
            // Absolute view names use a '@' symbol to distinguish the view and the state.
            // So 'foo@bar' means the ui-view named 'foo' within the 'bar' state's template.
            views: {

                // So this one is targeting the unnamed view within the parent state's template.
                '': {
                    templateUrl: 'app/welcome/contacts.detail.html',
                    controllerAs: 'welcomeDetail',
                    controller: ['$scope', '$stateParams',
                            function ($scope, $stateParams) {
                                var vm = this;
                                vm.contactId = $stateParams.contactId - 1;
                                vm.contact = $scope.$parent.welcome.contacts[$stateParams.contactId - 1];
                            }]
                },

                // This one is targeting the ui-view="hint" within the unnamed root, aka index.html.
                // This shows off how you could populate *any* view within *any* ancestor state.
                'hint@': {
                    template: 'This is contacts.detail populating the "hint" ui-view'
                },

                // This one is targeting the ui-view="menuTip" within the parent state's template.
                'menuTip': {
                    // templateProvider is the final method for supplying a template.
                    // There is: template, templateUrl, and templateProvider.
                    templateProvider: ['$stateParams',
                      function ($stateParams) {
                          // This is just to demonstrate that $stateParams injection works for templateProvider.
                          // $stateParams are the parameters for the new state we're transitioning to, even
                          // though the global '$stateParams' has not been updated yet.
                          return '<hr><small class="muted">Contact ID: ' + $stateParams.contactId + '</small>';
                      }]
                }
            }
        })

        //////////////////////////////
        // Contacts > Detail > Item //
        //////////////////////////////
           .state('state.welcome.detail.item', {

               // So following what we've learned, this state's full url will end up being
               // '/contacts/{contactId}/item/:itemId'. We are using both types of parameters
               // in the same url, but they behave identically.
               url: '/item/:itemId',
               views: {

                   // This is targeting the unnamed ui-view within the parent state 'contact.detail'
                   // We wouldn't have to do it this way if we didn't also want to set the 'hint' view below.
                   // We could instead just set templateUrl and controller outside of the view obj.
                   '': {
                       templateUrl: 'app/welcome/contacts.detail.item.html',
                       controllerAs: 'welcomeItem',
                       controller: ['$scope', '$stateParams', '$state',
                         function ($scope, $stateParams, $state) {
                             var vm = this;
                             vm.item = $scope.$parent.welcomeDetail.contact.items[$stateParams.itemId - 1];

                             vm.edit = function () {
                                 // Here we show off go's ability to navigate to a relative state. Using '^' to go upwards
                                 // and '.' to go down, you can navigate to any relative state (ancestor or descendant).
                                 // Here we are going down to the child state 'edit' (full name of 'contacts.detail.item.edit')
                                 $state.go('.edit', $stateParams);
                             };
                         }]
                   },

                   // Here we see we are overriding the template that was set by 'contacts.detail'
                   'hint@': {
                       template: ' This is contacts.detail.item overriding the "hint" ui-view'
                   }
               }
           })

         /////////////////////////////////////
        // Contacts > Detail > Item > Edit //
        /////////////////////////////////////      
        // Notice that this state has no 'url'. States do not require a url. You can use them
        // simply to organize your application into "places" where each "place" can configure
        // only what it needs. The only way to get to this state is via $state.go (or transitionTo)
        .state('state.welcome.detail.item.edit', {
            views: {

                // This is targeting the unnamed view within the 'welcome.detail' state
                // essentially swapping out the template that 'welcome.detail.item' had
                // inserted with this state's template.
                '@state.welcome.detail': {
                    templateUrl: 'app/welcome/contacts.detail.item.edit.html',
                    controllerAs: 'welcomeItemEdit',
                    controller: ['$scope', '$stateParams', '$state',
                      function ($scope, $stateParams, $state) {
                          var vm = this;
                          vm.item = $scope.$parent.welcomeDetail.contact.items[$stateParams.itemId - 1];
                          vm.done = function () {
                              // Go back up. '^' means up one. '^.^' would be up twice, to the grandparent.
                              $state.go('^', $stateParams);
                          };
                      }]
                }
            }
        });



    }
    ]
);

})();