'use strict';

describe('Memberships E2E Tests:', function () {
  describe('Test Memberships page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/memberships');
      expect(element.all(by.repeater('membership in memberships')).count()).toEqual(0);
    });
  });
});
