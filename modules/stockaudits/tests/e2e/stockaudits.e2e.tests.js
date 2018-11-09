'use strict';

describe('Stockaudits E2E Tests:', function () {
  describe('Test Stockaudits page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/stockaudits');
      expect(element.all(by.repeater('stockaudit in stockaudits')).count()).toEqual(0);
    });
  });
});
