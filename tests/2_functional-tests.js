const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const validString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

const validOutputString = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';

const invalidString = '..9..5.1.85.4....2432..5...1...69.83.9..5..6.62.71...9...5..1945....4.37.4.3..6..';

suite('Functional Tests', () => {
  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .send({ puzzle: validString })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'solution');
        assert.equal(res.body.solution, validOutputString);
        done();
      });
  });

  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .send({ puzzle: '' })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Required field missing');
        done();
      });
  });

  test('Solve a puzzle with invalid characters: POST request to /api/solve', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .send({ puzzle: 'string-with-invalid-characters' })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });

  test('Solve a puzzle with incorrect length: POST request to /api/solve', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .send({ puzzle: '123456789' })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });

  test('Solve a puzzle that cannot be solved: POST request to /api/solve', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .send({ puzzle: invalidString })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Puzzle cannot be solved');
        done();
      });
  });

  test('Check a puzzle placement with all fields: POST request to /api/check', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({ 
        puzzle: validString,
        coordinate: 'A1',
        value: '7'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'valid');
        assert.isTrue(res.body.valid);
        done();
      });
  });

  test('Check a puzzle placement with single placement conflict: POST request to /api/check', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({ 
        puzzle: validString,
        coordinate: 'A1',
        value: '6'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'valid');
        assert.property(res.body, 'conflict');
        assert.isArray(res.body.conflict);
        assert.isFalse(res.body.valid);
        assert.equal(res.body.conflict.length, 1);
        done();
      });
  });
  
  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({ 
        puzzle: validString,
        coordinate: 'A1',
        value: '4'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'valid');
        assert.property(res.body, 'conflict');
        assert.isArray(res.body.conflict);
        assert.isFalse(res.body.valid);
        assert.equal(res.body.conflict.length, 2);
        done();
      });
  });

  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({ 
        puzzle: validString,
        coordinate: 'A2',
        value: '9'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'valid');
        assert.property(res.body, 'conflict');
        assert.isArray(res.body.conflict);
        assert.isFalse(res.body.valid);
        assert.equal(res.body.conflict.length, 3);
        done();
      });
  });

  test('Check a puzzle placement with missing required fields: POST request to /api/check', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({ 
        puzzle: validString,
        coordinate: '',
        value: ''
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Required field(s) missing');
        done();
      });
  });

  test('Check a puzzle placement with invalid characters: POST request to /api/check', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({ 
        puzzle: 'invalid-characters',
        coordinate: 'A1',
        value: '7'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });

  test('Check a puzzle placement with incorrect length: POST request to /api/check', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({ 
        puzzle: '123456789',
        coordinate: 'A1',
        value: '7'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });

  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({ 
        puzzle: validString,
        coordinate: 'invalid-coordinate',
        value: '7'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid coordinate');
        done();
      });
  });

  test('Check a puzzle placement with incorrect length: POST request to /api/check', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({ 
        puzzle: validString,
        coordinate: 'A1',
        value: 'invalid_value'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid value');
        done();
      });
  });
});