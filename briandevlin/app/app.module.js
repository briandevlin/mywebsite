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