const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    let _id;
    //#1
    test('Test every field POST /api/issues/apitest', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/issues/apitest')
          .send({
            issue_title: 'Test title',
            issue_text: 'Test text',
            created_by: 'Tester',
            assigned_to: 'Tester',
            status_text: 'In test'
            })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, 'Test title');
            assert.equal(res.body.issue_text, 'Test text');
            assert.equal(res.body.created_by, 'Tester');
            assert.equal(res.body.assigned_to, 'Tester');
            assert.equal(res.body.status_text, 'In test');
            _id = res.body._id;
            done();
          });
    });

    //#2
    test('Test required fields POST /api/issues/apitest', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/issues/apitest')
          .send({
            issue_title: 'Test title',
            issue_text: 'Test text',
            created_by: 'Tester',
            })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, 'Test title');
            assert.equal(res.body.issue_text, 'Test text');
            assert.equal(res.body.created_by, 'Tester');
            assert.equal(res.body.assigned_to, '');
            assert.equal(res.body.status_text, '');
            done();
          });
    });

    //#3
    test('Test required field is missing POST /api/issues/apitest', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/issues/apitest')
          .send({
            issue_text: 'Test text',
            created_by: 'Tester',
            assigned_to: 'Tester',
            status_text: 'In test'
            })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'required field(s) missing');
            done();
          });
    });

    //#4
    test('Test GET /api/issues/apitest', function (done) {
        chai
          .request(server)
          .keepOpen()
          .get('/api/issues/apitest')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            done();
          });
    });

    //#5
    test('Test one filter GET /api/issues/apitest', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/issues/apitest?created_by=Tester')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            // assert.equal(res.body.created_by, 'Tester');
            done();
          });
    });

    //#6
    test('Test multiple filters GET /api/issues/apitest', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/issues/apitest?created_by=Tester&assigned_to=Tester')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            // assert.equal(res.body.created_by, 'Tester');
            done();
          });
    });

    //#7
    test('Test one field PUT /api/issues/apitest', function (done) {
        chai
          .request(server)
          .keepOpen()
          .put('/api/issues/apitest')
          .send({
            _id: _id,
            created_by: 'Tester2'
            })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, 'successfully updated');
            done();
          });
    });

    //#8
    test('Test several multiple fields PUT /api/issues/apitest', function (done) {
        chai
          .request(server)
          .keepOpen()
          .put('/api/issues/apitest')
          .send({
            _id: _id,
            created_by: 'Tester2',
            status_text: 'Another text'
            })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, 'successfully updated');
            done();
          });
    });

    //#9
    test('Test no fields PUT /api/issues/apitest', function (done) {
        chai
          .request(server)
          .keepOpen()
          .put('/api/issues/apitest')
          .send({
            _id: _id,
            })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'no update field(s) sent');
            done();
          });
    });


    //#10
    test('Test no _id PUT /api/issues/apitest', function (done) {
        chai
          .request(server)
          .keepOpen()
          .put('/api/issues/apitest')
          .send({
            created_by: 'Roma',
            })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'missing _id');
            done();
          });
    });

    //#11
    test('Test invalid _id PUT /api/issues/apitest', function (done) {
        chai
          .request(server)
          .keepOpen()
          .put('/api/issues/apitest')
          .send({
            _id: 'error',
            created_by: 'Roma'
            })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'could not update');
            done();
          });
    });

    //#12
    test('Test DELETE /api/issues/apitest', function (done) {
        chai
          .request(server)
          .keepOpen()
          .delete('/api/issues/apitest')
          .send({
            _id: _id,
            })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, 'successfully deleted');
            done();
          });
    });

    //#13
    test('Test invalid _id DELETE /api/issues/apitest', function (done) {
        chai
          .request(server)
          .keepOpen()
          .delete('/api/issues/apitest')
          .send({
            _id: 'invalid',
            })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'could not delete');
            done();
          });
    });

    //#14
    test('Test missing _id DELETE /api/issues/apitest', function (done) {
        chai
          .request(server)
          .keepOpen()
          .delete('/api/issues/apitest')
          .send({
            })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'missing _id');
            done();
          });
    });


});
