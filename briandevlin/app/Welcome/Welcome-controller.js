(function () {
    'use strict';

    angular
        .module('app.welcome')
        .controller('welcome-controller', WelcomeController);

    WelcomeController.$inject = ["$rootScope", "$scope", "$state", "resA", "greeting"/*, "promiseObj2"*/];

    function WelcomeController($rootScope, $scope, $state, resA, greeting /*, promiseObj2*/)
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