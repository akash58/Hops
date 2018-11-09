'use strict';

describe('Systemparameters E2E Tests:', function () {
  describe('Test Systemparameters page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/systemparameters');
      expect(element.all(by.repeater('systemparameter in systemparameters')).count()).toEqual(0);
    });
  });
});
