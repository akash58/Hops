// Units service used to communicate Units REST endpoints
(function () {
  'use strict';

  angular
    .module('units')
    .factory('UnitTypesService', UnitTypesService);

  UnitTypesService.$inject = ['$resource'];

  function UnitTypesService($resource) {
    return $resource('/api/unitTypes/:unitTypeId', {
      unitTypeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
