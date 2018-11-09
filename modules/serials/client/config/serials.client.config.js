// Configuring the Serials module

(function () {
  'use strict';

  angular
    .module('serials')
    .run(menuConfig);

  menuConfig.$inject = ['menuService', 'pageAuthentication'];

  function menuConfig(menuService, pageAuthentication) {
    // .addMenuItem('topbar', 'Games', 'serialsMenuItem', 'dropdown', 'serials', 1, rolesVisibleAll)
    // console.log(pageAuthentication.getRoles('Games Types'));

    pageAuthentication.getRoles(['Game Types', 'Games', 'Serials'])
      // .then(pageAuthentication.getRoles('Games'))
      // .then(pageAuthentication.getRoles('Serials'))
      .then(function(rolesArray) {
        // console.log(rolesArray.length);
        var mergedRoles = [];
        for (var i = 0; i < rolesArray.length; i++) {
          mergedRoles = angular.extend(mergedRoles, rolesArray[i]);
        }

        menuService.addMenuItem('topbar', {
          position: 1,
          title: 'Games',
          state: 'serials',
          type: 'dropdown',
          // roles: ['admin', 'user']
          roles: mergedRoles
        });

        // Add the dropdown list item
        // .addSubMenuItem('topbar', 'serialsMenuItem', 'Game Types', 'gametypes', 'gametypes', rolesVisibleComponents);

          // console.log(roles);
        menuService.addSubMenuItem('topbar', 'serials', {
          title: 'Game Types',
          state: 'listComponents',
          // roles: ['admin']
          // roles: []
          roles: rolesArray[0]
        });

        // Menus.addSubMenuItem('topbar', 'serialsMenuItem', 'Games', 'games', 'games', rolesVisibleProducts);
        menuService.addSubMenuItem('topbar', 'serials', {
          title: 'Games',
          state: 'listProducts',
          roles: rolesArray[1]
        });

        // Menus.addSubMenuItem('topbar', 'serialsMenuItem', 'Serials', 'serials', 'serials', rolesVisibleSerials);
        menuService.addSubMenuItem('topbar', 'serials', {
          title: 'Serials',
          state: 'listSerials',
          roles: rolesArray[2]
        });
      });
  }
}());

// angular.module('serials').run(['Menus', 'pageAuthentication', ,
//   function(Menus, pageAuthentication) {
//     // var rolesVisible = ['admin'];
//     var rolesVisibleSerials = [];
//     var rolesVisibleProducts = [];
//     var rolesVisibleComponents = [];
//     var rolesVisibleAll = [];

//     pageAuthentication.getRoles('Serials').then(function(res) {
//       // console.log(res);
//       rolesVisibleSerials = res;
//       pageAuthentication.getRoles('Games').then(function(res) {
//         rolesVisibleProducts = res;
//         pageAuthentication.getRoles('Game Types').then(function(res) {
//           rolesVisibleComponents = res;

//           function arrayUnique(array) {
//             var a = array.concat();
//             for (var i = 0; i < a.length; ++i) {
//               for (var j = i + 1; j < a.length; ++j) {
//                 if (a[i] === a[j]) a.splice(j--, 1);
//               }
//             }
//             return a;
//           }

//           // Merges both arrays and gets unique items
//           rolesVisibleAll = arrayUnique(rolesVisibleSerials.concat(rolesVisibleProducts).concat(rolesVisibleComponents));

//           Menus.addMenuItem('topbar', 'Games', 'serialsMenuItem', 'dropdown', 'serials', 1, rolesVisibleAll);
//           Menus.addSubMenuItem('topbar', 'serialsMenuItem', 'Game Types', 'gametypes', 'gametypes', rolesVisibleComponents);
//           Menus.addSubMenuItem('topbar', 'serialsMenuItem', 'Games', 'games', 'games', rolesVisibleProducts);
//           Menus.addSubMenuItem('topbar', 'serialsMenuItem', 'Serials', 'serials', 'serials', rolesVisibleSerials);
//         });
//       });
//     });

//   //  var pages = Pages.query( function(){
//   //    for (var i in pages) {
//   //      if (pages[i].pageName === 'Serials')
//   //        for(var j in pages[i].roles) {
//   //          rolesVisibleSerials.push(pages[i].roles[j]);
//   //          rolesVisibleAll.push(pages[i].roles[j]);
//   //        }
//   //    //for products
//   //      else if (pages[i].pageName === 'Games')
//   //          for(var k in pages[i].roles) {
//   //            rolesVisibleProducts.push(pages[i].roles[k]);
//   //            if (rolesVisibleAll.indexOf(pages[i].roles[k]) < 0 )
//   //              rolesVisibleAll.push(pages[i].roles[k]);
//   //          }
//   //    //for components
//   //      else if (pages[i].pageName === 'Game Types')
//   //          for(var g in pages[i].roles) {
//   //            rolesVisibleComponents.push(pages[i].roles[g]);
//   //            if (rolesVisibleAll.indexOf(pages[i].roles[g]) < 0 )
//   //              rolesVisibleAll.push(pages[i].roles[g]);
//   //          }
//   //    }

//   //    //var rolesVisibleSerialsProducts = [];
//   //    //rolesVisibleSerialsProducts = rolesVisibleSerials;

//   //    //for (var m in rolesVisibleProducts)
//   //    //  if (rolesVisibleSerialsProducts.indexOf(rolesVisibleProducts[m]) === -1)
//   //    //    rolesVisibleSerialsProducts.push(rolesVisibleProducts[m]);

//   //    // Set top bar menu items
//   //    Menus.addMenuItem('topbar', 'Games', 'serialsMenuItem','dropdown', 'serials',1, rolesVisibleAll );
//   //    Menus.addSubMenuItem('topbar', 'serialsMenuItem', 'Game Types', 'gametypes', 'gametypes',rolesVisibleComponents);
//   //    Menus.addSubMenuItem('topbar', 'serialsMenuItem', 'Games', 'games', 'games',rolesVisibleProducts);
//   //    Menus.addSubMenuItem('topbar', 'serialsMenuItem', 'Serials',  'serials', 'serials', rolesVisibleSerials );
//   // /* }); */});
//   }
// ]);
