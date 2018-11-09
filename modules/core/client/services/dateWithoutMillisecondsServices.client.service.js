'use strict';

// foodOrder service used for communicating with the foodOrders REST endpoint
angular.module('core').factory('TodaysDateWithoutMilliseconds', function() {
  // function dateWithoutMilliseconds() {
  var date = new Date();

  var day = date.getDate();
  var month = date.getMonth();
  var year = date.getFullYear();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var seconds = date.getSeconds();

  if (month < 10) month = '0' + month;
  if (day < 10) day = '0' + day;

  // var today = year + '-' + month + '-' + day;
  var today = new Date(year, month, day, hour, minute, seconds);
  return today;
  // };
});
