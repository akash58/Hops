'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Stockaudit = mongoose.model('Stockaudit'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  stockaudit;

/**
 * Stockaudit routes tests
 */
describe('Stockaudit CRUD tests', function () {

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

    // Save a user to the test db and create new Stockaudit
    user.save(function () {
      stockaudit = {
        name: 'Stockaudit name'
      };

      done();
    });
  });

  it('should be able to save a Stockaudit if logged in', function (done) {
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

        // Save a new Stockaudit
        agent.post('/api/stockaudits')
          .send(stockaudit)
          .expect(200)
          .end(function (stockauditSaveErr, stockauditSaveRes) {
            // Handle Stockaudit save error
            if (stockauditSaveErr) {
              return done(stockauditSaveErr);
            }

            // Get a list of Stockaudits
            agent.get('/api/stockaudits')
              .end(function (stockauditsGetErr, stockauditsGetRes) {
                // Handle Stockaudits save error
                if (stockauditsGetErr) {
                  return done(stockauditsGetErr);
                }

                // Get Stockaudits list
                var stockaudits = stockauditsGetRes.body;

                // Set assertions
                (stockaudits[0].user._id).should.equal(userId);
                (stockaudits[0].name).should.match('Stockaudit name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Stockaudit if not logged in', function (done) {
    agent.post('/api/stockaudits')
      .send(stockaudit)
      .expect(403)
      .end(function (stockauditSaveErr, stockauditSaveRes) {
        // Call the assertion callback
        done(stockauditSaveErr);
      });
  });

  it('should not be able to save an Stockaudit if no name is provided', function (done) {
    // Invalidate name field
    stockaudit.name = '';

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

        // Save a new Stockaudit
        agent.post('/api/stockaudits')
          .send(stockaudit)
          .expect(400)
          .end(function (stockauditSaveErr, stockauditSaveRes) {
            // Set message assertion
            (stockauditSaveRes.body.message).should.match('Please fill Stockaudit name');

            // Handle Stockaudit save error
            done(stockauditSaveErr);
          });
      });
  });

  it('should be able to update an Stockaudit if signed in', function (done) {
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

        // Save a new Stockaudit
        agent.post('/api/stockaudits')
          .send(stockaudit)
          .expect(200)
          .end(function (stockauditSaveErr, stockauditSaveRes) {
            // Handle Stockaudit save error
            if (stockauditSaveErr) {
              return done(stockauditSaveErr);
            }

            // Update Stockaudit name
            stockaudit.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Stockaudit
            agent.put('/api/stockaudits/' + stockauditSaveRes.body._id)
              .send(stockaudit)
              .expect(200)
              .end(function (stockauditUpdateErr, stockauditUpdateRes) {
                // Handle Stockaudit update error
                if (stockauditUpdateErr) {
                  return done(stockauditUpdateErr);
                }

                // Set assertions
                (stockauditUpdateRes.body._id).should.equal(stockauditSaveRes.body._id);
                (stockauditUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Stockaudits if not signed in', function (done) {
    // Create new Stockaudit model instance
    var stockauditObj = new Stockaudit(stockaudit);

    // Save the stockaudit
    stockauditObj.save(function () {
      // Request Stockaudits
      request(app).get('/api/stockaudits')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Stockaudit if not signed in', function (done) {
    // Create new Stockaudit model instance
    var stockauditObj = new Stockaudit(stockaudit);

    // Save the Stockaudit
    stockauditObj.save(function () {
      request(app).get('/api/stockaudits/' + stockauditObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', stockaudit.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Stockaudit with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/stockaudits/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Stockaudit is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Stockaudit which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Stockaudit
    request(app).get('/api/stockaudits/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Stockaudit with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Stockaudit if signed in', function (done) {
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

        // Save a new Stockaudit
        agent.post('/api/stockaudits')
          .send(stockaudit)
          .expect(200)
          .end(function (stockauditSaveErr, stockauditSaveRes) {
            // Handle Stockaudit save error
            if (stockauditSaveErr) {
              return done(stockauditSaveErr);
            }

            // Delete an existing Stockaudit
            agent.delete('/api/stockaudits/' + stockauditSaveRes.body._id)
              .send(stockaudit)
              .expect(200)
              .end(function (stockauditDeleteErr, stockauditDeleteRes) {
                // Handle stockaudit error error
                if (stockauditDeleteErr) {
                  return done(stockauditDeleteErr);
                }

                // Set assertions
                (stockauditDeleteRes.body._id).should.equal(stockauditSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Stockaudit if not signed in', function (done) {
    // Set Stockaudit user
    stockaudit.user = user;

    // Create new Stockaudit model instance
    var stockauditObj = new Stockaudit(stockaudit);

    // Save the Stockaudit
    stockauditObj.save(function () {
      // Try deleting Stockaudit
      request(app).delete('/api/stockaudits/' + stockauditObj._id)
        .expect(403)
        .end(function (stockauditDeleteErr, stockauditDeleteRes) {
          // Set message assertion
          (stockauditDeleteRes.body.message).should.match('User is not authorized');

          // Handle Stockaudit error error
          done(stockauditDeleteErr);
        });

    });
  });

  it('should be able to get a single Stockaudit that has an orphaned user reference', function (done) {
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

          // Save a new Stockaudit
          agent.post('/api/stockaudits')
            .send(stockaudit)
            .expect(200)
            .end(function (stockauditSaveErr, stockauditSaveRes) {
              // Handle Stockaudit save error
              if (stockauditSaveErr) {
                return done(stockauditSaveErr);
              }

              // Set assertions on new Stockaudit
              (stockauditSaveRes.body.name).should.equal(stockaudit.name);
              should.exist(stockauditSaveRes.body.user);
              should.equal(stockauditSaveRes.body.user._id, orphanId);

              // force the Stockaudit to have an orphaned user reference
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

                    // Get the Stockaudit
                    agent.get('/api/stockaudits/' + stockauditSaveRes.body._id)
                      .expect(200)
                      .end(function (stockauditInfoErr, stockauditInfoRes) {
                        // Handle Stockaudit error
                        if (stockauditInfoErr) {
                          return done(stockauditInfoErr);
                        }

                        // Set assertions
                        (stockauditInfoRes.body._id).should.equal(stockauditSaveRes.body._id);
                        (stockauditInfoRes.body.name).should.equal(stockaudit.name);
                        should.equal(stockauditInfoRes.body.user, undefined);

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
      Stockaudit.remove().exec(done);
    });
  });
});
