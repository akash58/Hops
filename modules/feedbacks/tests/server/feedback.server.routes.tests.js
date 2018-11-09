'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Feedback = mongoose.model('Feedback'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  feedback;

/**
 * Feedback routes tests
 */
describe('Feedback CRUD tests', function () {

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

    // Save a user to the test db and create new Feedback
    user.save(function () {
      feedback = {
        name: 'Feedback name'
      };

      done();
    });
  });

  it('should be able to save a Feedback if logged in', function (done) {
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

        // Save a new Feedback
        agent.post('/api/feedbacks')
          .send(feedback)
          .expect(200)
          .end(function (feedbackSaveErr, feedbackSaveRes) {
            // Handle Feedback save error
            if (feedbackSaveErr) {
              return done(feedbackSaveErr);
            }

            // Get a list of Feedbacks
            agent.get('/api/feedbacks')
              .end(function (feedbacksGetErr, feedbacksGetRes) {
                // Handle Feedbacks save error
                if (feedbacksGetErr) {
                  return done(feedbacksGetErr);
                }

                // Get Feedbacks list
                var feedbacks = feedbacksGetRes.body;

                // Set assertions
                (feedbacks[0].user._id).should.equal(userId);
                (feedbacks[0].name).should.match('Feedback name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Feedback if not logged in', function (done) {
    agent.post('/api/feedbacks')
      .send(feedback)
      .expect(403)
      .end(function (feedbackSaveErr, feedbackSaveRes) {
        // Call the assertion callback
        done(feedbackSaveErr);
      });
  });

  it('should not be able to save an Feedback if no name is provided', function (done) {
    // Invalidate name field
    feedback.name = '';

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

        // Save a new Feedback
        agent.post('/api/feedbacks')
          .send(feedback)
          .expect(400)
          .end(function (feedbackSaveErr, feedbackSaveRes) {
            // Set message assertion
            (feedbackSaveRes.body.message).should.match('Please fill Feedback name');

            // Handle Feedback save error
            done(feedbackSaveErr);
          });
      });
  });

  it('should be able to update an Feedback if signed in', function (done) {
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

        // Save a new Feedback
        agent.post('/api/feedbacks')
          .send(feedback)
          .expect(200)
          .end(function (feedbackSaveErr, feedbackSaveRes) {
            // Handle Feedback save error
            if (feedbackSaveErr) {
              return done(feedbackSaveErr);
            }

            // Update Feedback name
            feedback.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Feedback
            agent.put('/api/feedbacks/' + feedbackSaveRes.body._id)
              .send(feedback)
              .expect(200)
              .end(function (feedbackUpdateErr, feedbackUpdateRes) {
                // Handle Feedback update error
                if (feedbackUpdateErr) {
                  return done(feedbackUpdateErr);
                }

                // Set assertions
                (feedbackUpdateRes.body._id).should.equal(feedbackSaveRes.body._id);
                (feedbackUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Feedbacks if not signed in', function (done) {
    // Create new Feedback model instance
    var feedbackObj = new Feedback(feedback);

    // Save the feedback
    feedbackObj.save(function () {
      // Request Feedbacks
      request(app).get('/api/feedbacks')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Feedback if not signed in', function (done) {
    // Create new Feedback model instance
    var feedbackObj = new Feedback(feedback);

    // Save the Feedback
    feedbackObj.save(function () {
      request(app).get('/api/feedbacks/' + feedbackObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', feedback.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Feedback with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/feedbacks/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Feedback is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Feedback which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Feedback
    request(app).get('/api/feedbacks/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Feedback with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Feedback if signed in', function (done) {
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

        // Save a new Feedback
        agent.post('/api/feedbacks')
          .send(feedback)
          .expect(200)
          .end(function (feedbackSaveErr, feedbackSaveRes) {
            // Handle Feedback save error
            if (feedbackSaveErr) {
              return done(feedbackSaveErr);
            }

            // Delete an existing Feedback
            agent.delete('/api/feedbacks/' + feedbackSaveRes.body._id)
              .send(feedback)
              .expect(200)
              .end(function (feedbackDeleteErr, feedbackDeleteRes) {
                // Handle feedback error error
                if (feedbackDeleteErr) {
                  return done(feedbackDeleteErr);
                }

                // Set assertions
                (feedbackDeleteRes.body._id).should.equal(feedbackSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Feedback if not signed in', function (done) {
    // Set Feedback user
    feedback.user = user;

    // Create new Feedback model instance
    var feedbackObj = new Feedback(feedback);

    // Save the Feedback
    feedbackObj.save(function () {
      // Try deleting Feedback
      request(app).delete('/api/feedbacks/' + feedbackObj._id)
        .expect(403)
        .end(function (feedbackDeleteErr, feedbackDeleteRes) {
          // Set message assertion
          (feedbackDeleteRes.body.message).should.match('User is not authorized');

          // Handle Feedback error error
          done(feedbackDeleteErr);
        });

    });
  });

  it('should be able to get a single Feedback that has an orphaned user reference', function (done) {
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

          // Save a new Feedback
          agent.post('/api/feedbacks')
            .send(feedback)
            .expect(200)
            .end(function (feedbackSaveErr, feedbackSaveRes) {
              // Handle Feedback save error
              if (feedbackSaveErr) {
                return done(feedbackSaveErr);
              }

              // Set assertions on new Feedback
              (feedbackSaveRes.body.name).should.equal(feedback.name);
              should.exist(feedbackSaveRes.body.user);
              should.equal(feedbackSaveRes.body.user._id, orphanId);

              // force the Feedback to have an orphaned user reference
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

                    // Get the Feedback
                    agent.get('/api/feedbacks/' + feedbackSaveRes.body._id)
                      .expect(200)
                      .end(function (feedbackInfoErr, feedbackInfoRes) {
                        // Handle Feedback error
                        if (feedbackInfoErr) {
                          return done(feedbackInfoErr);
                        }

                        // Set assertions
                        (feedbackInfoRes.body._id).should.equal(feedbackSaveRes.body._id);
                        (feedbackInfoRes.body.name).should.equal(feedback.name);
                        should.equal(feedbackInfoRes.body.user, undefined);

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
      Feedback.remove().exec(done);
    });
  });
});
