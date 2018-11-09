// Systemparameters service used to communicate Systemparameters REST endpoints
(function () {
  'use strict';

  angular
    .module('systemparameters')
    .factory('SystemparametersService', SystemparametersService);

  SystemparametersService.$inject = ['$resource'];

  function SystemparametersService($resource) {
    return $resource('/api/systemparameters/:systemparameterId', {
      systemparameterId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
