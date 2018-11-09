'use strict';

describe('Units E2E Tests:', function () {
  describe('Test Units page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/units');
      expect(element.all(by.repeater('unit in units')).count()).toEqual(0);
    });
  });
});
