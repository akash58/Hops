(function () {
  'use strict';

// core service used for communicating with the pages management REST endpoint
  angular
    .module('core')
    .service('pageAuthentication', pageAuthentication);

  pageAuthentication.$inject = ['PagesService', 'Authentication', '$q', '$state', '$timeout'];

  function pageAuthentication(PagesService, Authentication, $q, $state, $timeout) {
    var pages = [];
    var counter = 0;
    var pending = false;
    var promises = [];

    function getPages() {
      // var authentication =Authentication;
      // var pages=[];
      // if (counter >= 1 && pending)
      //  return $q.reject();
      // else {
      var defer = $q.defer();
      // console.log('called');
      promises.push(defer.promise);
      if (!pending) {
        pending = true;
        PagesService.query(function(response) {
          // console.log(response);
          // console.log(authentication);
          pages = response;
          pending = false;
          defer.resolve();
        }, function(err) {
          defer.reject(err);
        });
      }
      return defer.promise;
      // }
    }

    function getRoles(pageNames) {
      /* if (counter >= 1 && pending) {
        $timeout(function(pageNames) {
          return getRoles(pageNames);
        });
      } else { */
      var defered = $q.defer();

      var rolesArray = [];

      if (!Authentication.user) {
        defered.resolve([]);
      } else if (pages.length > 0) {
        var found = false;
        for (var p = 0; p < pageNames.length; p++)
          for (var i = 0; i < pages.length; i++) {
            if (pages[i].pageName === pageNames[p]) {
              rolesArray[p] = pages[i].roles;
              /* rolesArray[p] = [];
              for (var j = 0; j < pages[i].roles.length; j++) {
                rolesArray[p].push(pages[i].roles[j]);
              } */
              found = true;
              break;
            }
          }
        defered.resolve(rolesArray);
        if (!found) defered.reject('Page Management data for atleast one of ' + JSON.stringify(pageNames) + ' not found!! Please Contact Support with screenshot!');
      } else {
        // counter = counter + 1;
        // if (counter <= 1) {
        getPages();
        $q.race(promises).then(function() {
          getRoles(pageNames).then(function(resultRoles) {
            // promise = [];
            defered.resolve(resultRoles);
          }).catch(function(err) {
            defered.reject(err);
          });
        });
        /* } else {
          $state.go('bad-request', { message: 'Please Contact Support with screenshot!! Basic Page Management Data not defined during seed db!' });
        } */
      }

      // console.log(defered.promise);
      return defered.promise;
      // }
    }

    return {
      // getPages:getPages,
      getRoles: getRoles
    };

  }
}());
