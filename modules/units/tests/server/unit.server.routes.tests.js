'use strict';
var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  // Unit = mongoose.model('Unit'),
  CompanyGroup = mongoose.model('CompanyGroup'),
  express = require(path.resolve('./config/lib/express'));

// Globals

var app,
  agent,
  credentials,
  user,
  unit,
  companyGroup,
  companyGroupId;

// Unit routes tests

describe('Unit CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new companyGroup
    companyGroup = new CompanyGroup({
      companyGroupName: 'Mean Test'
      // tenantDbName: 'mean-test'
    });

    // Save a companyGroup to the test db and create new user
    companyGroup.save(function () {
      companyGroupId = companyGroup._id;

      // Create a new user
      user = new User({
        firstName: 'Full',
        lastName: 'Name',
        displayName: 'Full Name',
        email: 'test@test.com',
        username: credentials.usernameOrEmail,
        password: credentials.password,
        provider: 'local',
        roles: ['admin'],
        companyGroup: companyGroupId
      });

      // Save a user to the test db and create new Unit
      user.save(function () {
        unit = {
          name: 'Unit name',
          unitType: '56fd42f490ffdfb9f69b1954',
          symbol: 'Kg',
          multiplierWithBaseUnit: 25,
          note: 'Notes'
        };

        done();
      });
    });
  });

  it('should be able to save a Unit if logged in', function (done) {
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

        // Save a new Unit
        agent.post('/api/units')
          .send(unit)
          .expect(200)
          .end(function (unitSaveErr, unitSaveRes) {
            // Handle Unit save error
            if (unitSaveErr) {
              return done(unitSaveErr);
            }

            // Get a list of Units
            agent.get('/api/units')
              .end(function (unitsGetErr, unitsGetRes) {
                // Handle Units save error
                if (unitsGetErr) {
                  return done(unitsGetErr);
                }

                // Get Units list
                var units = unitsGetRes.body;

                // Set assertions
                (units[0].user).should.equal(userId);
                (units[0].name).should.match('Unit name');
                (units[0].unitType).should.match('56fd42f490ffdfb9f69b1954');
                (units[0].symbol).should.match('Kg');
                (units[0].multiplierWithBaseUnit).should.match(25);
                (units[0].note).should.match('Notes');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Unit if not logged in', function (done) {
    agent.post('/api/units')
      .send(unit)
      .expect(403)
      .end(function (unitSaveErr, unitSaveRes) {
        // Call the assertion callback
        done(unitSaveErr);
      });
  });

  it('should not be able to save an Unit if no name is provided', function (done) {
    // Invalidate name field
    unit.name = '';

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

        // Save a new Unit
        agent.post('/api/units')
          .send(unit)
          .expect(400)
          .end(function (unitSaveErr, unitSaveRes) {
            // Set message assertion
            (unitSaveRes.body.message).should.match('Please fill Unit name');

            // Handle Unit save error
            done(unitSaveErr);
          });
      });
  });

  it('should not be able to save an Unit if no unitType is provided', function (done) {
    // Invalidate unitType field
    unit.unitType = '';

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

        // Save a new Unit
        agent.post('/api/units')
          .send(unit)
          .expect(400)
          .end(function (unitSaveErr, unitSaveRes) {
            // Set message assertion
            (unitSaveRes.body.message).should.match('Cast to ObjectID failed for value "" at path "unitType"');

            // Handle Unit save error
            done(unitSaveErr);
          });
      });
  });

  it('should not be able to save an Unit if no symbol is provided', function (done) {
    // Invalidate symbol field
    unit.symbol = '';

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

        // Save a new Unit
        agent.post('/api/units')
          .send(unit)
          .expect(400)
          .end(function (unitSaveErr, unitSaveRes) {
            // Set message assertion
            (unitSaveRes.body.message).should.match('Please fill Unit symbol');

            // Handle Unit save error
            done(unitSaveErr);
          });
      });
  });

  it('should not be able to save an Unit if no multiplierWithBaseUnit is provided', function (done) {
    // Invalidate multiplierWithBaseUnit field
    unit.multiplierWithBaseUnit = '';

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

        // Save a new Unit
        agent.post('/api/units')
          .send(unit)
          .expect(400)
          .end(function (unitSaveErr, unitSaveRes) {
            // Set message assertion
            (unitSaveRes.body.message).should.match('Please fill multiplier With Base Unit');

            // Handle Unit save error
            done(unitSaveErr);
          });
      });
  });

/*  it('should be able to update an Unit if signed in', function (done) {
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

        // Save a new Unit
        agent.post('/api/units')
          .send(unit)
          .expect(200)
          .end(function (unitSaveErr, unitSaveRes) {
            // Handle Unit save error
            if (unitSaveErr) {
              return done(unitSaveErr);
            }

            // Update Unit name
            unit.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Unit
            agent.put('/api/units/' + unitSaveRes.body._id)
              .send(unit)
              .expect(200)
              .end(function (unitUpdateErr, unitUpdateRes) {
                // Handle Unit update error
                if (unitUpdateErr) {
                  return done(unitUpdateErr);
                }

                // Set assertions
                (unitUpdateRes.body._id).should.equal(unitSaveRes.body._id);
                (unitUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });*/

  it('should return proper error for single Unit with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/units/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Unit is invalid');

        // Call the assertion callback
        done();
      });
  });

/*  it('should be able to delete an Unit if signed in', function (done) {
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

        // Save a new Unit
        agent.post('/api/units')
          .send(unit)
          .expect(200)
          .end(function (unitSaveErr, unitSaveRes) {
            // Handle Unit save error
            if (unitSaveErr) {
              return done(unitSaveErr);
            }

            // Delete an existing Unit
            agent.delete('/api/units/' + unitSaveRes.body._id)
              .send(unit)
              .expect(200)
              .end(function (unitDeleteErr, unitDeleteRes) {
                // Handle unit error error
                if (unitDeleteErr) {
                  return done(unitDeleteErr);
                }

                // Set assertions
                (unitDeleteRes.body._id).should.equal(unitSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });*/

/*  it('should be able to get a single Unit that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      usernameOrEmail: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.usernameOrEmail,
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

          // Save a new Unit
          agent.post('/api/units')
            .send(unit)
            .expect(200)
            .end(function (unitSaveErr, unitSaveRes) {
              // Handle Unit save error
              if (unitSaveErr) {
                return done(unitSaveErr);
              }

              // Set assertions on new Unit
              (unitSaveRes.body.name).should.equal(unit.name);
              should.exist(unitSaveRes.body.user);
              should.equal(unitSaveRes.body.user._id, orphanId);

              // force the Unit to have an orphaned user reference
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

                    // Get the Unit
                    agent.get('/api/units/' + unitSaveRes.body._id)
                      .expect(200)
                      .end(function (unitInfoErr, unitInfoRes) {
                        // Handle Unit error
                        if (unitInfoErr) {
                          return done(unitInfoErr);
                        }

                        // Set assertions
                        (unitInfoRes.body._id).should.equal(unitSaveRes.body._id);
                        (unitInfoRes.body.name).should.equal(unit.name);
                        should.equal(unitInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });*/

  afterEach(function (done) {
    User.remove().exec(function () {
      // Unit.remove().exec(done);
      done();
    });
  });
});

