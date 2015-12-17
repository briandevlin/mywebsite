(function () {
    'use strict';

    angular
        .module('app.route1')
        .controller('route1Controller', Route1Controller);

    Route1Controller.$inject = ["$state", 'resource1', '$stateParams'];
    function Route1Controller($state, resource1, $stateParams) {
        var vm = this;

        console.log('in Route1Controller');

        console.log($state.current.data.customDataHello)
        console.log($state.current.data.customDataWorld)
      
        InitailizeController();

        function InitailizeController() {

           // vm.contactId = $stateParams.contactId;
            vm.data = $state.current.data;
            vm.resource = resource1.value;

            vm.items = ["A", "List", "Of", "Items"];

        }
    }
})();