'use strict';

// contentgroup service used for communicating with the contentgroups REST endpoint
angular.module('contentgroups').factory('Contentgroups', ['$resource',
  function($resource) {
    return $resource('/api/contentgroups/:contentgroupId', {
      contentgroupId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
