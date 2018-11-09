'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  // Unit = mongoose.model('Unit');
  registerUnit = require('../../server/models/unit.server.model'),
  Unit = registerUnit(mongoose);

/**
 * Globals
 */
var user,
  unit;

/**
 * Unit tests
 */
describe('Unit Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      unit = new Unit({
        name: 'Unit Name',
        unitType: '56fd42f490ffdfb9f69b1954',
        symbol: 'Kg',
        multiplierWithBaseUnit: '25',
        note: 'Notes',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      // this.timeout(0);
      unit.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      unit.name = '';

      unit.save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without unitType', function(done) {
      unit.unitType = '';

      unit.save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without symbol', function(done) {
      unit.symbol = '';

      unit.save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without multiplierWithBaseUnit', function(done) {
      unit.multiplierWithBaseUnit = '';

      unit.save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without note', function(done) {
      unit.note = '';

      unit.save(function(err) {
        should.not.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Unit.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
