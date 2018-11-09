'use strict';

describe('Packages E2E Tests:', function () {
  describe('Test Packages page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/packages');
      expect(element.all(by.repeater('package in packages')).count()).toEqual(0);
    });
  });
});
