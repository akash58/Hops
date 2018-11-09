'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Baseunit = mongoose.model('Baseunit');

/**
 * Globals
 */
var user,
  baseunit;

/**
 * Unit tests
 */
describe('Baseunit Model Unit Tests:', function() {
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
      baseunit = new Baseunit({
        name: 'Baseunit Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return baseunit.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      baseunit.name = '';

      return baseunit.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Baseunit.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
