const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    // test('Test every field POST /api/issues/apitest', function (done) {
    //     chai
    //       .request(server)
    //       .keepOpen()
    //       .post('/api/issues/apitest')
    //       .send({
    //         issue_title: 'Test title',
    //         issue_text: 'Test text',
    //         created_by: 'Tester',
    //         assigned_to: 'Tester',
    //         status_text: 'In test'
    //         })
    //       .end(function (err, res) {
    //         assert.equal(res.status, 200);
    //         assert.equal(res.body.issue_title, 'Test title');
    //         done();
    //       });
    // });
});
