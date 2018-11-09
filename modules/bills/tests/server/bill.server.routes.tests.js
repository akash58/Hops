'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Bill = mongoose.model('Bill'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  bill;

/**
 * Bill routes tests
 */
describe('Bill CRUD tests', function () {

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

    // Save a user to the test db and create new Bill
    user.save(function () {
      bill = {
        name: 'Bill name'
      };

      done();
    });
  });

  it('should be able to save a Bill if logged in', function (done) {
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

        // Save a new Bill
        agent.post('/api/bills')
          .send(bill)
          .expect(200)
          .end(function (billSaveErr, billSaveRes) {
            // Handle Bill save error
            if (billSaveErr) {
              return done(billSaveErr);
            }

            // Get a list of Bills
            agent.get('/api/bills')
              .end(function (billsGetErr, billsGetRes) {
                // Handle Bills save error
                if (billsGetErr) {
                  return done(billsGetErr);
                }

                // Get Bills list
                var bills = billsGetRes.body;

                // Set assertions
                (bills[0].user._id).should.equal(userId);
                (bills[0].name).should.match('Bill name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Bill if not logged in', function (done) {
    agent.post('/api/bills')
      .send(bill)
      .expect(403)
      .end(function (billSaveErr, billSaveRes) {
        // Call the assertion callback
        done(billSaveErr);
      });
  });

  it('should not be able to save an Bill if no name is provided', function (done) {
    // Invalidate name field
    bill.name = '';

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

        // Save a new Bill
        agent.post('/api/bills')
          .send(bill)
          .expect(400)
          .end(function (billSaveErr, billSaveRes) {
            // Set message assertion
            (billSaveRes.body.message).should.match('Please fill Bill name');

            // Handle Bill save error
            done(billSaveErr);
          });
      });
  });

  it('should be able to update an Bill if signed in', function (done) {
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

        // Save a new Bill
        agent.post('/api/bills')
          .send(bill)
          .expect(200)
          .end(function (billSaveErr, billSaveRes) {
            // Handle Bill save error
            if (billSaveErr) {
              return done(billSaveErr);
            }

            // Update Bill name
            bill.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Bill
            agent.put('/api/bills/' + billSaveRes.body._id)
              .send(bill)
              .expect(200)
              .end(function (billUpdateErr, billUpdateRes) {
                // Handle Bill update error
                if (billUpdateErr) {
                  return done(billUpdateErr);
                }

                // Set assertions
                (billUpdateRes.body._id).should.equal(billSaveRes.body._id);
                (billUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Bills if not signed in', function (done) {
    // Create new Bill model instance
    var billObj = new Bill(bill);

    // Save the bill
    billObj.save(function () {
      // Request Bills
      request(app).get('/api/bills')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Bill if not signed in', function (done) {
    // Create new Bill model instance
    var billObj = new Bill(bill);

    // Save the Bill
    billObj.save(function () {
      request(app).get('/api/bills/' + billObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', bill.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Bill with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/bills/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Bill is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Bill which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Bill
    request(app).get('/api/bills/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Bill with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Bill if signed in', function (done) {
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

        // Save a new Bill
        agent.post('/api/bills')
          .send(bill)
          .expect(200)
          .end(function (billSaveErr, billSaveRes) {
            // Handle Bill save error
            if (billSaveErr) {
              return done(billSaveErr);
            }

            // Delete an existing Bill
            agent.delete('/api/bills/' + billSaveRes.body._id)
              .send(bill)
              .expect(200)
              .end(function (billDeleteErr, billDeleteRes) {
                // Handle bill error error
                if (billDeleteErr) {
                  return done(billDeleteErr);
                }

                // Set assertions
                (billDeleteRes.body._id).should.equal(billSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Bill if not signed in', function (done) {
    // Set Bill user
    bill.user = user;

    // Create new Bill model instance
    var billObj = new Bill(bill);

    // Save the Bill
    billObj.save(function () {
      // Try deleting Bill
      request(app).delete('/api/bills/' + billObj._id)
        .expect(403)
        .end(function (billDeleteErr, billDeleteRes) {
          // Set message assertion
          (billDeleteRes.body.message).should.match('User is not authorized');

          // Handle Bill error error
          done(billDeleteErr);
        });

    });
  });

  it('should be able to get a single Bill that has an orphaned user reference', function (done) {
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

          // Save a new Bill
          agent.post('/api/bills')
            .send(bill)
            .expect(200)
            .end(function (billSaveErr, billSaveRes) {
              // Handle Bill save error
              if (billSaveErr) {
                return done(billSaveErr);
              }

              // Set assertions on new Bill
              (billSaveRes.body.name).should.equal(bill.name);
              should.exist(billSaveRes.body.user);
              should.equal(billSaveRes.body.user._id, orphanId);

              // force the Bill to have an orphaned user reference
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

                    // Get the Bill
                    agent.get('/api/bills/' + billSaveRes.body._id)
                      .expect(200)
                      .end(function (billInfoErr, billInfoRes) {
                        // Handle Bill error
                        if (billInfoErr) {
                          return done(billInfoErr);
                        }

                        // Set assertions
                        (billInfoRes.body._id).should.equal(billSaveRes.body._id);
                        (billInfoRes.body.name).should.equal(bill.name);
                        should.equal(billInfoRes.body.user, undefined);

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
      Bill.remove().exec(done);
    });
  });
});
