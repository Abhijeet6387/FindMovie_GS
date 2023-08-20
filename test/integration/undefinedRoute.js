import mocha from 'mocha';
import supertest from 'supertest';
import assert from 'node:assert';
import app from '../../server.js';



mocha.describe('Integration::Undefined route', () => {

    mocha.describe('GET /undefined_route', () => {
        mocha.it('should return status 404 and correct response signature', (done) => {
            supertest(app)
                .post('/')
                .send({})
                .expect(404)
                .expect(res => {
                    assert.strictEqual(res.body.hasOwnProperty('ok'), true);
                    assert.strictEqual(res.body.hasOwnProperty('error'), true);

                    assert.strictEqual(res.body.ok, false);
                })
                .end((err, res) => {
                    if(err) throw err;
                    done();
                });
        });
    });

});
