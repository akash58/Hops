'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Systemparameter = mongoose.model('Systemparameter'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  systemparameter;

/**
 * Systemparameter routes tests
 */
describe('Systemparameter CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Systemparameter
    user.save(function () {
      systemparameter = {
        name: 'Systemparameter name'
      };

      done();
    });
  });

  it('should be able to save a Systemparameter if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Systemparameter
        agent.post('/api/systemparameters')
          .send(systemparameter)
          .expect(200)
          .end(function (systemparameterSaveErr, systemparameterSaveRes) {
            // Handle Systemparameter save error
            if (systemparameterSaveErr) {
              return done(systemparameterSaveErr);
            }

            // Get a list of Systemparameters
            agent.get('/api/systemparameters')
              .end(function (systemparametersGetErr, systemparametersGetRes) {
                // Handle Systemparameters save error
                if (systemparametersGetErr) {
                  return done(systemparametersGetErr);
                }

                // Get Systemparameters list
                var systemparameters = systemparametersGetRes.body;

                // Set assertions
                (systemparameters[0].user._id).should.equal(userId);
                (systemparameters[0].name).should.match('Systemparameter name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Systemparameter if not logged in', function (done) {
    agent.post('/api/systemparameters')
      .send(systemparameter)
      .expect(403)
      .end(function (systemparameterSaveErr, systemparameterSaveRes) {
        // Call the assertion callback
        done(systemparameterSaveErr);
      });
  });

  it('should not be able to save an Systemparameter if no name is provided', function (done) {
    // Invalidate name field
    systemparameter.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Systemparameter
        agent.post('/api/systemparameters')
          .send(systemparameter)
          .expect(400)
          .end(function (systemparameterSaveErr, systemparameterSaveRes) {
            // Set message assertion
            (systemparameterSaveRes.body.message).should.match('Please fill Systemparameter name');

            // Handle Systemparameter save error
            done(systemparameterSaveErr);
          });
      });
  });

  it('should be able to update an Systemparameter if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Systemparameter
        agent.post('/api/systemparameters')
          .send(systemparameter)
          .expect(200)
          .end(function (systemparameterSaveErr, systemparameterSaveRes) {
            // Handle Systemparameter save error
            if (systemparameterSaveErr) {
              return done(systemparameterSaveErr);
            }

            // Update Systemparameter name
            systemparameter.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Systemparameter
            agent.put('/api/systemparameters/' + systemparameterSaveRes.body._id)
              .send(systemparameter)
              .expect(200)
              .end(function (systemparameterUpdateErr, systemparameterUpdateRes) {
                // Handle Systemparameter update error
                if (systemparameterUpdateErr) {
                  return done(systemparameterUpdateErr);
                }

                // Set assertions
                (systemparameterUpdateRes.body._id).should.equal(systemparameterSaveRes.body._id);
                (systemparameterUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Systemparameters if not signed in', function (done) {
    // Create new Systemparameter model instance
    var systemparameterObj = new Systemparameter(systemparameter);

    // Save the systemparameter
    systemparameterObj.save(function () {
      // Request Systemparameters
      request(app).get('/api/systemparameters')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Systemparameter if not signed in', function (done) {
    // Create new Systemparameter model instance
    var systemparameterObj = new Systemparameter(systemparameter);

    // Save the Systemparameter
    systemparameterObj.save(function () {
      request(app).get('/api/systemparameters/' + systemparameterObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', systemparameter.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Systemparameter with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/systemparameters/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Systemparameter is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Systemparameter which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Systemparameter
    request(app).get('/api/systemparameters/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Systemparameter with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Systemparameter if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Systemparameter
        agent.post('/api/systemparameters')
          .send(systemparameter)
          .expect(200)
          .end(function (systemparameterSaveErr, systemparameterSaveRes) {
            // Handle Systemparameter save error
            if (systemparameterSaveErr) {
              return done(systemparameterSaveErr);
            }

            // Delete an existing Systemparameter
            agent.delete('/api/systemparameters/' + systemparameterSaveRes.body._id)
              .send(systemparameter)
              .expect(200)
              .end(function (systemparameterDeleteErr, systemparameterDeleteRes) {
                // Handle systemparameter error error
                if (systemparameterDeleteErr) {
                  return done(systemparameterDeleteErr);
                }

                // Set assertions
                (systemparameterDeleteRes.body._id).should.equal(systemparameterSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Systemparameter if not signed in', function (done) {
    // Set Systemparameter user
    systemparameter.user = user;

    // Create new Systemparameter model instance
    var systemparameterObj = new Systemparameter(systemparameter);

    // Save the Systemparameter
    systemparameterObj.save(function () {
      // Try deleting Systemparameter
      request(app).delete('/api/systemparameters/' + systemparameterObj._id)
        .expect(403)
        .end(function (systemparameterDeleteErr, systemparameterDeleteRes) {
          // Set message assertion
          (systemparameterDeleteRes.body.message).should.match('User is not authorized');

          // Handle Systemparameter error error
          done(systemparameterDeleteErr);
        });

    });
  });

  it('should be able to get a single Systemparameter that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Systemparameter
          agent.post('/api/systemparameters')
            .send(systemparameter)
            .expect(200)
            .end(function (systemparameterSaveErr, systemparameterSaveRes) {
              // Handle Systemparameter save error
              if (systemparameterSaveErr) {
                return done(systemparameterSaveErr);
              }

              // Set assertions on new Systemparameter
              (systemparameterSaveRes.body.name).should.equal(systemparameter.name);
              should.exist(systemparameterSaveRes.body.user);
              should.equal(systemparameterSaveRes.body.user._id, orphanId);

              // force the Systemparameter to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Systemparameter
                    agent.get('/api/systemparameters/' + systemparameterSaveRes.body._id)
                      .expect(200)
                      .end(function (systemparameterInfoErr, systemparameterInfoRes) {
                        // Handle Systemparameter error
                        if (systemparameterInfoErr) {
                          return done(systemparameterInfoErr);
                        }

                        // Set assertions
                        (systemparameterInfoRes.body._id).should.equal(systemparameterSaveRes.body._id);
                        (systemparameterInfoRes.body.name).should.equal(systemparameter.name);
                        should.equal(systemparameterInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Systemparameter.remove().exec(done);
    });
  });
});
