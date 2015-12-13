
//*********************************************************
// File: c:\users\brian\documents\visual studio 2013\Projects\briandevlin\briandevlin\app/app.core.module.js
// Last updated: 12/13/2015 1:24:47 PM
//
(function () {
    'use strict';

    angular
        .module('app.core', [
          
            'ui.router',           
            'ui.bootstrap',        
            'ui.grid',              
            'ui.grid.selection',
            'ngAnimate'   
        ]);
})();
//*********************************************************
// File: c:\users\brian\documents\visual studio 2013\Projects\briandevlin\briandevlin\app/app.module.js
// Last updated: 12/13/2015 1:24:47 PM
//
(function () {
    'use strict';

    angular
        .module('app', [
            /*
         * Order is not important. Angular makes a
         * pass to register all of the modules listed        
         */

        /*
         * Everybody has access to these.
         * We could place these under every feature area,
         * but this is easier to maintain.
         */
        'app.core',
      
        /*
         * Feature areas
         */          
            'app.welcome',
             'app.route1'
        ]);
})();
//*********************************************************
// File: c:\users\brian\documents\visual studio 2013\Projects\briandevlin\briandevlin\app/app.config.js
// Last updated: 12/13/2015 1:24:47 PM
//
(function () {
    'use strict';

    angular
        .module('app')
        .run(
          ['$rootScope', '$state', '$stateParams',
            function ($rootScope, $state, $stateParams) {

                // It's very handy to add references to $state and $stateParams to the $rootScope
                // so that you can access them from any scope within your applications.For example,
                // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
                // to active whenever 'contacts.list' or one of its decendents is active.
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
                $rootScope.$on('$stateChangeStart', function (event, toState) {
                    // var greeting = toState.data.customdata1 + " and " + toState.data.customdata2;
                    console.log('$stateChangeStart');

                    // would print "hello world!" when 'parent' is activated
                    // would print "hello ui-router!" when 'parent.child' is activated
                });
                $rootScope.$on('$stateNotFound',
                    function (event, unfoundState, fromState, fromParams) {
                        console.log('$stateNotFound ');
                        console.log('To: ' + unfoundState.to); 
                        console.log('ToParams: ' + unfoundState.toParams); 
                        console.log('options: ' + unfoundState.options); 
                    });
                $rootScope.$on('$viewContentLoading',
                    function (event, viewConfig) {
                        // Access to all the view config properties.
                        // and one special property 'targetView'
                        // viewConfig.targetView 
                        console.log('$viewContentLoading ' + viewConfig);
                    });
               
            }
          ]
        )
        .config(uiRouteConfig);

    uiRouteConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
    function uiRouteConfig( $stateProvider, $urlRouterProvider, $locationProvider) {

        $locationProvider.html5Mode(false);

        //////////////////////////
        // State Configurations //
        //////////////////////////
        // This will get automatically plugged into the unnamed ui-view 
        // of the parent state template. Since this is a top level state, 
        // its parent state template is index.cshtml.
        $stateProvider
       
         .state('state.state2', {
             url: "/state2",
             templateUrl: "app/welcome/route2.html"
         })
         .state('state.state2.list', {
             url: "/list",
             templateUrl: "app/welcome/route2.list.html",
             controller: ['$scope',function ($scope) {
                 $scope.things = ["A", "Set", "Of", "Things"];
             }]
         })
        .state('welcome', {
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
                
                greeting: ['$q', '$timeout',function ($q, $timeout) {
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
         .state('about', {
             url: '/about',

             // Showing off how you could return a promise from templateProvider
             templateProvider: ['$timeout',
               function ($timeout) {
                   return $timeout(function () {
                       return '<p class="lead">UI-Router Resources</p><ul>' +
                                '<li><a href="https://github.com/angular-ui/ui-router/tree/master/sample">Source for this Sample</a></li>' +
                                '<li><a href="https://github.com/angular-ui/ui-router">GitHub Main Page</a></li>' +
                                '<li><a href="https://github.com/angular-ui/ui-router#quick-start">Quick Start</a></li>' +
                                '<li><a href="https://github.com/angular-ui/ui-router/wiki">In-Depth Guide</a></li>' +
                                '<li><a href="https://github.com/angular-ui/ui-router/wiki/Quick-Reference">API Reference</a></li>' +
                              '</ul>';
                   }, 100);
               }]
         })

          .state('about-me', {
              url: '/about-me',
             
              template: 'About Me',
              data: {
                  auth: true
              }
          })

        /////////////////////////////
        // Redirects and Otherwise //
        /////////////////////////////

        $urlRouterProvider.otherwise("/state/state1")

    }

    HttpInterceptorConfig.$inject = ['$httpProvider'];
    function HttpInterceptorConfig($httpProvider) {
        var httpInterceptor = ['$window', '$q', function ($window, $q) {
            function success(response) {
                return response;
            }

            function error(response) {
                switch (response.status) {
                    //browsers capture the 302 and return a new XmlHTTPRequest object in place of the original one
                    //so we cannot directly handle the 302 nor can we direct the user to the location of the redirect
                    //instead we must direct them to the origin page of the application they're using which will force reauthentication
                    case 0:
                        if (response.data == "") {
                            $window.location.href = $window.location.origin;
                        }
                        return;
                        break;
                    case 401:
                        $window.location.href = $window.location.origin;
                        return;
                        break;
                    default:
                        break;
                }
                return $q.reject(response);
            }

            return function (promise) {
                return promise.then(success, error);
            }
        }];

        $httpProvider.responseInterceptors.push(httpInterceptor);
    }

    //function WowJSAnimations() {
    //    new WOW().init();
    //}
})();
//*********************************************************
// File: c:\users\brian\documents\visual studio 2013\Projects\briandevlin\briandevlin\app/route1/route1-module.js
// Last updated: 12/13/2015 1:24:47 PM
//
(function () {
    'use strict';

    angular
        .module('app.route1', [
            'ui.router'
        ]);
})();
//*********************************************************
// File: c:\users\brian\documents\visual studio 2013\Projects\briandevlin\briandevlin\app/Welcome/welcome-module.js
// Last updated: 12/13/2015 1:24:47 PM
//
(function () {
    'use strict';

    angular
        .module('app.welcome', [
            'ui.router'
        ])
    .config(
    ['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        console.info('in app.welcome.config');

        $stateProvider
        //////////////
        // Contacts //
        //////////////
          .state('contacts', {
              abstract: true,
              parent: 'welcome',
              // This abstract state will prepend '/contacts' onto the urls of all its children.
              url: '/contacts',

              data:{
                  // customData1 inherited from 'parent'
                  // but we'll overwrite customData2
                  customData2:  "UI-Router!"
              },
              template: '<h1>header title</h1>',
              controller: ['$scope', 'resA',function ($scope, resA) {
                  $scope.resA = resA.value;
                  $scope.title = 'My Contacts';
              }]
                                               
          })

        /////////////////////
        // Contacts > List //
        /////////////////////


        // Using a '.' within a state name declares a child within a parent.
        // So you have a new state 'list' within the parent 'welcome' state.
        .state('list', {
            parent: 'welcome',
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
        .state('welcome.detail', {

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
                    controller: ['$scope', '$stateParams',
                function ($scope, $stateParams) {
                    $scope.contact = $scope.contacts[ $stateParams.contactId - 1];
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
           .state('welcome.detail.item', {

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
                       controller: ['$scope', '$stateParams', '$state',
                         function ($scope, $stateParams, $state) {
                             $scope.item = $scope.contact.items[$stateParams.itemId - 1];

                             $scope.edit = function () {
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
        .state('welcome.detail.item.edit', {
            views: {

                // This is targeting the unnamed view within the 'contacts.detail' state
                // essentially swapping out the template that 'contacts.detail.item' had
                // inserted with this state's template.
                '@welcome.detail': {
                    templateUrl: 'app/welcome/contacts.detail.item.edit.html',
                    controller: ['$scope', '$stateParams', '$state',
                      function ($scope, $stateParams, $state) {
                          $scope.item = $scope.contact.items[$stateParams.itemId - 1];
                          $scope.done = function () {
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
//*********************************************************
// File: c:\users\brian\documents\visual studio 2013\Projects\briandevlin\briandevlin\app/route1/route1-config.js
// Last updated: 12/13/2015 1:24:47 PM
//
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
           // parent: 'state1',
            url: "/alist",
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
//*********************************************************
// File: c:\users\brian\documents\visual studio 2013\Projects\briandevlin\briandevlin\app/route1/route1-controller.js
// Last updated: 12/13/2015 1:24:47 PM
//
(function () {
    'use strict';

    angular
        .module('app.route1')
        .controller('route1Controller', route1Controller);

    route1Controller.$inject = ["$state", 'resource1'];
    function route1Controller($state, resource1) {
        var vm = this;
      
        InitailizeController();

        function InitailizeController() {
           
            vm.resource = resource1.value;

            vm.items = ["A", "List", "Of", "Items"];

        }
    }
})();
//*********************************************************
// File: c:\users\brian\documents\visual studio 2013\Projects\briandevlin\briandevlin\app/Welcome/Welcome-controller.js
// Last updated: 12/13/2015 1:24:47 PM
//
(function () {
    'use strict';

    angular
        .module('app.welcome')
        .controller('welcome-controller', welcomeController);

    welcomeController.$inject = ["$rootScope", "$scope", "$state", "resA", "greeting"/*, "promiseObj2"*/];

    function welcomeController($rootScope, $scope, $state, resA, greeting /*, promiseObj2*/)
    {
        var vm = this;

        console.info(resA.value);
        console.info(greeting);
        console.info(vm);
        //console.info(promiseObj2);
        //console.log($state.current.data);

        vm.resB = 'resource B';

        IniailizeController();

        function IniailizeController()
        {
            

            $rootScope.$on('$statechangestart', function (event, tostate) {
                //var greeting = tostate.data.customdata1 + " and " + tostate.data.customdata2;
                //console.log(greeting);

                // would print "hello world!" when 'parent' is activated
                // would print "hello ui-router!" when 'parent.child' is activated
            });
           
           // $scope.resA = resA.value;
            vm.contacts = [
                                {
                                    "id": 1,
                                    "name": "Alice",
                                    "items": [
                                      {
                                          "id": "1",
                                          "type": "phone number",
                                          "value": "555-1234-1234"
                                      },
                                      {
                                          "id": "2",
                                          "type": "email",
                                          "value": "alice@mailinator.com"
                                      }
                                    ]
                                },
                                {
                                    "id": 2,
                                    "name": "Bob",
                                    "items": [
                                      {
                                          "id": "1",
                                          "type": "blog",
                                          "value": "http://bob.blogger.com"
                                      },
                                      {
                                          "id": "2",
                                          "type": "fax",
                                          "value": "555-999-9999"
                                      }
                                    ]
                                },
                                {
                                    "id": 3,
                                    "name": "Eve",
                                    "items": [
                                      {
                                          "id": "1",
                                          "type": "full name",
                                          "value": "Eve Adamsdottir"
                                      }
                                    ]
                                }
                            ]


        }
    }
})();