(function () {
    'use strict';

    angular
        .module('app.route1')
        .controller('route1Controller', Route1Controller);

    Route1Controller.$inject = ["$state", 'resource1'];
    function Route1Controller($state, resource1) {
        var vm = this;
      
        InitailizeController();

        function InitailizeController() {
           
            vm.resource = resource1.value;

            vm.items = ["A", "List", "Of", "Items"];

        }
    }
})();