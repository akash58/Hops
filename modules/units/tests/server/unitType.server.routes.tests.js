'use strict';
var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  // Unittype = mongoose.model('Unittype'),
  CompanyGroup = mongoose.model('CompanyGroup'),
  express = require(path.resolve('./config/lib/express'));

// Globals

var app,
  agent,
  credentials,
  user,
  unitType,
  companyGroup,
  companyGroupId;

// Unittype routes tests

describe('Unittype CRUD tests', function () {

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

      // Save a user to the test db and create new Unittype
      user.save(function () {
        unitType = {
          name: 'Unit Type Name',
          baseUnitName: 'Kilo Gram',
          baseUnitSymbol: 'Kg',
          // baseUnitId: '5996e73183f58825dc5014b3',
          note: 'Notes'
        };

        done();
      });
    });
  });

  it('should be able to save a Unittype if logged in', function (done) {
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

        // Save a new Unittype
        agent.post('/api/unitTypes')
          .send(unitType)
          .expect(200)
          .end(function (unitSaveErr, unitSaveRes) {
            // Handle Unittype save error
            if (unitSaveErr) {
              return done(unitSaveErr);
            }

            // Get a list of Units
            agent.get('/api/unitTypes')
              .end(function (unitTypesGetErr, unitTypesGetRes) {
                // Handle Units save error
                if (unitTypesGetErr) {
                  return done(unitTypesGetErr);
                }

                // Get Units list
                var unitTypes = unitTypesGetRes.body;

                // Set assertions
                (unitTypes[0].user).should.equal(userId);
                (unitTypes[0].name).should.match('Unit Type Name');
                (unitTypes[0].baseUnitName).should.match('Kilo Gram');
                (unitTypes[0].baseUnitSymbol).should.match('Kg');
                // (unitTypes[0].baseUnitId).should.match('5996e73183f58825dc5014b3');
                (unitTypes[0].note).should.match('Notes');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Unittype if not logged in', function (done) {
    agent.post('/api/unitTypes')
      .send(unitType)
      .expect(403)
      .end(function (unitTypeSaveErr, unitTypeSaveRes) {
        // Call the assertion callback
        done(unitTypeSaveErr);
      });
  });

  it('should not be able to save an Unittype if no name is provided', function (done) {
    // Invalidate name field
    unitType.name = '';

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

        // Save a new Unittype
        agent.post('/api/unitTypes')
          .send(unitType)
          .expect(400)
          .end(function (unitTypeSaveErr, unitTypeSaveRes) {
            // Set message assertion
            (unitTypeSaveRes.body.message).should.match('Please fill unit type name');

            // Handle Unittype save error
            done(unitTypeSaveErr);
          });
      });
  });

  it('should not be able to save an Unittype if no baseUnitName is provided', function (done) {
    // Invalidate baseUnitName field
    unitType.baseUnitName = '';

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

        // Save a new Unittype
        agent.post('/api/unitTypes')
          .send(unitType)
          .expect(400)
          .end(function (unitTypeSaveErr, unitTypeSaveRes) {
            // Set message assertion
            (unitTypeSaveRes.body.message).should.match('Please fill base unit name');

            // Handle Unittype save error
            done(unitTypeSaveErr);
          });
      });
  });

  it('should not be able to save an Unittype if no baseUnitSymbol is provided', function (done) {
    // Invalidate baseUnitSymbol field
    unitType.baseUnitSymbol = '';

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

        // Save a new Unittype
        agent.post('/api/unitTypes')
          .send(unitType)
          .expect(400)
          .end(function (unitTypeSaveErr, unitTypeSaveRes) {
            // Set message assertion
            (unitTypeSaveRes.body.message).should.match('Please fill base unit symbol');

            // Handle Unittype save error
            done(unitTypeSaveErr);
          });
      });
  });

  it('should not be able to save an Unittype if no baseUnitId is provided', function (done) {
    // Invalidate baseUnitId field
    unitType.baseUnitId = '';

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

        // Save a new Unittype
        agent.post('/api/unitTypes')
          .send(unitType)
          .expect(400)
          .end(function (unitTypeSaveErr, unitTypeSaveRes) {
            // Set message assertion
            (unitTypeSaveRes.body.message).should.match('Name already exists');

            // Handle Unittype save error
            done(unitTypeSaveErr);
          });
      });
  });

/*  it('should be able to update an Unittype if signed in', function (done) {
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

        // Save a new Unittype
        agent.post('/api/unitTypes')
          .send(unitType)
          .expect(200)
          .end(function (unitTypeSaveErr, unitTypeSaveRes) {
            // Handle Unittype save error
            if (unitTypeSaveErr) {
              return done(unitTypeSaveErr);
            }

            // Update Unittype name
            unitType.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Unittype
            agent.put('/api/unitTypes/' + unitTypeSaveRes.body._id)
              .send(unitType)
              .expect(200)
              .end(function (unitTypeUpdateErr, unitTypeUpdateRes) {
                // Handle Unittype update error
                if (unitTypeUpdateErr) {
                  return done(unitTypeUpdateErr);
                }

                // Set assertions
                (unitTypeUpdateRes.body._id).should.equal(unitTypeSaveRes.body._id);
                (unitTypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });*/

  it('should return proper error for single Unittype with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/unitTypes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Unit Type is invalid');

        // Call the assertion callback
        done();
      });
  });

/*  it('should be able to get a single Unittype that has an orphaned user reference', function (done) {
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

          // Save a new Unittype
          agent.post('/api/unitTypes')
            .send(unitType)
            .expect(200)
            .end(function (unitTypesSaveErr, unitTypeSaveRes) {
              // Handle Unittype save error
              if (unitTypesSaveErr) {
                return done(unitTypesSaveErr);
              }

              // Set assertions on new Unittype
              (unitTypeSaveRes.body.name).should.equal(unitType.name);
              should.exist(unitTypeSaveRes.body.user);
              should.equal(unitTypeSaveRes.body.user._id, orphanId);

              // force the Unittype to have an orphaned user reference
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

                    // Get the Unittype
                    agent.get('/api/unitTypes/' + unitTypeSaveRes.body._id)
                      .expect(200)
                      .end(function (unitTypeInfoErr, unitTypeInfoRes) {
                        // Handle Unittype error
                        if (unitTypeInfoErr) {
                          return done(unitTypeInfoErr);
                        }

                        // Set assertions
                        (unitTypeInfoRes.body._id).should.equal(unitTypeSaveRes.body._id);
                        (unitTypeInfoRes.body.name).should.equal(unitType.name);
                        should.equal(unitTypeInfoRes.body.user, undefined);

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
      // Unittype.remove().exec(done);
      done();
    });
  });
});

