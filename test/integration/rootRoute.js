import mocha from 'mocha';
import supertest from 'supertest';
import assert from 'node:assert';
import app from '../../server.js';


mocha.describe('Integration::Root route', () => {

    mocha.describe('GET /', () => {
        mocha.it('should return status 200 and correct response signature', (done) => {
            supertest(app)
                .get('/')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(res => {
                  assert.strictEqual(res.body.hasOwnProperty("ok"), true);
                  assert.strictEqual(res.body.hasOwnProperty("data"), true);
                  assert.strictEqual(res.body.ok, true);
                  assert.strictEqual(Array.isArray(res.body.data.movies), true); 
                  assert.strictEqual(res.body.data.movies.length > 0, true);
                })
                .end((err, res) => {
                    if(err) throw err;
                    done();
                });
        })
    });

    mocha.describe('POST /', () => {
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
