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
                $rootScope.$on('$stateChangeStart', function (event, tostate) {
                   // var greeting = tostate.data.customdata1 + " and " + tostate.data.customdata2;
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
    function uiRouteConfig($stateProvider, $urlRouterProvider, $locationProvider) {

        $locationProvider.html5Mode(true);

        //////////////////////////
        // State Configurations //
        //////////////////////////
        // This will get automatically plugged into the unnamed ui-view 
        // of the parent state template. Since this is a top level state, 
        // its parent state template is index.cshtml.
        $stateProvider
         .state('state1', {
             url: "/state1",
             templateUrl: "app/welcome/route1.html"
         })
        .state('state1.list', {
            url: "/list",
            templateUrl: "app/welcome/route1.list.html",
            controller: ['$scope',function ($scope) {
                $scope.items = ["A", "List", "Of", "Items"];
            }]
        })
         .state('state2', {
             url: "/state2",
             templateUrl: "app/welcome/route2.html"
         })
         .state('state2.list', {
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
            onEnter: function (resA) {
                console.info('onEnter: ' + resA);
            },
            onExit: function (resA) {
                console.info('onExit: ' + resA);
            },
            resolve: {
                // Example using function with simple return value.
                // Since it's not a promise, it resolves immediately.               
                resA: function () {
                    return { 'value': ' Inherited value' };
                },
                // Example showing returning of custom made promise
                greeting: function ($q, $timeout) {
                    var deferred = $q.defer();
                    $timeout(function () {
                        deferred.resolve('Hello!');
                    }, 1000);
                    return deferred.promise;
                },
                // Another promise example. If you need to do some 
                // processing of the result, use .then, and your 
                // promise is chained in for free. This is another
                // typical use case of resolve.
                promiseObj2: function ($http) {
                    return $http({ method: 'GET', url: '#/route1' })
                       .then(function (data) {
                           //return doSomeStuffFirst(data);
                           return data;
                       });
                }
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

        $urlRouterProvider.otherwise("/state1")

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