'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Membership = mongoose.model('Membership'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  membership;

/**
 * Membership routes tests
 */
describe('Membership CRUD tests', function () {

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

    // Save a user to the test db and create new Membership
    user.save(function () {
      membership = {
        name: 'Membership name'
      };

      done();
    });
  });

  it('should be able to save a Membership if logged in', function (done) {
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

        // Save a new Membership
        agent.post('/api/memberships')
          .send(membership)
          .expect(200)
          .end(function (membershipSaveErr, membershipSaveRes) {
            // Handle Membership save error
            if (membershipSaveErr) {
              return done(membershipSaveErr);
            }

            // Get a list of Memberships
            agent.get('/api/memberships')
              .end(function (membershipsGetErr, membershipsGetRes) {
                // Handle Memberships save error
                if (membershipsGetErr) {
                  return done(membershipsGetErr);
                }

                // Get Memberships list
                var memberships = membershipsGetRes.body;

                // Set assertions
                (memberships[0].user._id).should.equal(userId);
                (memberships[0].name).should.match('Membership name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Membership if not logged in', function (done) {
    agent.post('/api/memberships')
      .send(membership)
      .expect(403)
      .end(function (membershipSaveErr, membershipSaveRes) {
        // Call the assertion callback
        done(membershipSaveErr);
      });
  });

  it('should not be able to save an Membership if no name is provided', function (done) {
    // Invalidate name field
    membership.name = '';

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

        // Save a new Membership
        agent.post('/api/memberships')
          .send(membership)
          .expect(400)
          .end(function (membershipSaveErr, membershipSaveRes) {
            // Set message assertion
            (membershipSaveRes.body.message).should.match('Please fill Membership name');

            // Handle Membership save error
            done(membershipSaveErr);
          });
      });
  });

  it('should be able to update an Membership if signed in', function (done) {
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

        // Save a new Membership
        agent.post('/api/memberships')
          .send(membership)
          .expect(200)
          .end(function (membershipSaveErr, membershipSaveRes) {
            // Handle Membership save error
            if (membershipSaveErr) {
              return done(membershipSaveErr);
            }

            // Update Membership name
            membership.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Membership
            agent.put('/api/memberships/' + membershipSaveRes.body._id)
              .send(membership)
              .expect(200)
              .end(function (membershipUpdateErr, membershipUpdateRes) {
                // Handle Membership update error
                if (membershipUpdateErr) {
                  return done(membershipUpdateErr);
                }

                // Set assertions
                (membershipUpdateRes.body._id).should.equal(membershipSaveRes.body._id);
                (membershipUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Memberships if not signed in', function (done) {
    // Create new Membership model instance
    var membershipObj = new Membership(membership);

    // Save the membership
    membershipObj.save(function () {
      // Request Memberships
      request(app).get('/api/memberships')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Membership if not signed in', function (done) {
    // Create new Membership model instance
    var membershipObj = new Membership(membership);

    // Save the Membership
    membershipObj.save(function () {
      request(app).get('/api/memberships/' + membershipObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', membership.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Membership with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/memberships/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Membership is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Membership which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Membership
    request(app).get('/api/memberships/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Membership with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Membership if signed in', function (done) {
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

        // Save a new Membership
        agent.post('/api/memberships')
          .send(membership)
          .expect(200)
          .end(function (membershipSaveErr, membershipSaveRes) {
            // Handle Membership save error
            if (membershipSaveErr) {
              return done(membershipSaveErr);
            }

            // Delete an existing Membership
            agent.delete('/api/memberships/' + membershipSaveRes.body._id)
              .send(membership)
              .expect(200)
              .end(function (membershipDeleteErr, membershipDeleteRes) {
                // Handle membership error error
                if (membershipDeleteErr) {
                  return done(membershipDeleteErr);
                }

                // Set assertions
                (membershipDeleteRes.body._id).should.equal(membershipSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Membership if not signed in', function (done) {
    // Set Membership user
    membership.user = user;

    // Create new Membership model instance
    var membershipObj = new Membership(membership);

    // Save the Membership
    membershipObj.save(function () {
      // Try deleting Membership
      request(app).delete('/api/memberships/' + membershipObj._id)
        .expect(403)
        .end(function (membershipDeleteErr, membershipDeleteRes) {
          // Set message assertion
          (membershipDeleteRes.body.message).should.match('User is not authorized');

          // Handle Membership error error
          done(membershipDeleteErr);
        });

    });
  });

  it('should be able to get a single Membership that has an orphaned user reference', function (done) {
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

          // Save a new Membership
          agent.post('/api/memberships')
            .send(membership)
            .expect(200)
            .end(function (membershipSaveErr, membershipSaveRes) {
              // Handle Membership save error
              if (membershipSaveErr) {
                return done(membershipSaveErr);
              }

              // Set assertions on new Membership
              (membershipSaveRes.body.name).should.equal(membership.name);
              should.exist(membershipSaveRes.body.user);
              should.equal(membershipSaveRes.body.user._id, orphanId);

              // force the Membership to have an orphaned user reference
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

                    // Get the Membership
                    agent.get('/api/memberships/' + membershipSaveRes.body._id)
                      .expect(200)
                      .end(function (membershipInfoErr, membershipInfoRes) {
                        // Handle Membership error
                        if (membershipInfoErr) {
                          return done(membershipInfoErr);
                        }

                        // Set assertions
                        (membershipInfoRes.body._id).should.equal(membershipSaveRes.body._id);
                        (membershipInfoRes.body.name).should.equal(membership.name);
                        should.equal(membershipInfoRes.body.user, undefined);

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
      Membership.remove().exec(done);
    });
  });
});
