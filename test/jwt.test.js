const assert = require('assert');
const fetch = require('node-fetch');

const linklet = require('linklet');
const {compose} = require('linklet');
const {withJWTAuth} = require('../lib');

const sut = linklet(
  compose(
    withJWTAuth({
      secret: 'SuperSecret'
    })
  )(req => ({msg: 'done', user: req.user}))
);

describe('Linklet compose withJWTAuth() tests', () => {
  let instance = null;

  before(() => (instance = sut.listen()));
  after(() => instance.close());

  it('Should response 401 without JSON Web Token', () => {
    return fetch(`http://localhost:${instance.address().port}`).then(response =>
      assert.equal(response.status, 401)
    );
  });

  it('Should response 401 with wrong JSON Web Token', () => {
    return fetch(`http://localhost:${instance.address().port}`, {
      headers: {Authorization: `Bearer wrong`}
    }).then(response => assert.equal(response.status, 401));
  });

  it('Should response 200 with valid JSON Web Token', () => {
    return fetch(`http://localhost:${instance.address().port}`, {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibWlrZSIsImlhdCI6MTUxMjgxMjI4Nn0.SI8VHwLMBdzjhmThVi0rXDORnenVR226pDd3U7yPWtM`
      }
    })
      .then(response => response.json())
      .then(actual => {
        assert.equal(actual.user.name, 'mike');
        assert.deepEqual(actual.msg, 'done');
      });
  });
});
