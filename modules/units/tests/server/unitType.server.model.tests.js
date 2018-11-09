'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  // Unittype = mongoose.model('Unittype');
  registerUnittype = require('../../server/models/unitType.server.model'),
  Unittype = registerUnittype(mongoose);

/**
 * Globals
 */
var user,
  unitType;

/**
 * Unittype tests
 */
describe('Unittype Model Unittype Tests:', function() {
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
      unitType = new Unittype({
        name: 'Unit Type Name',
        baseUnitName: 'Kilo Gram',
        baseUnitSymbol: 'Kg',
        baseUnitId: '56fd42f490ffdfb9f69b1956',
        note: 'Notes',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      // this.timeout(0);
      unitType.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      unitType.name = '';

      unitType.save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without baseUnitName', function(done) {
      unitType.baseUnitName = '';

      unitType.save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without baseUnitSymbol', function(done) {
      unitType.baseUnitSymbol = '';

      unitType.save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without baseUnitId', function(done) {
      unitType.baseUnitId = '';

      unitType.save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without note', function(done) {
      unitType.note = '';

      unitType.save(function(err) {
        should.not.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Unittype.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
