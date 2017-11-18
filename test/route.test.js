const assert = require('assert');
const fetch = require('node-fetch');

const linklet = require('linklet');
const {compose} = require('linklet');
const {withRoute} = require('../lib');

const sut = linklet(
  compose(
    withRoute({
      path: '/items/:id?',
      GET: (req, res) => (req.params.id ? {id: 1} : [{id: 1}, {id: 2}])
    })
  )()
);

describe('Linklet compose handler tests', () => {
  let instance = null;

  before(() => (instance = sut.listen()));
  after(() => instance.close());

  it('Should handle route /items withRoute()', () => {
    return fetch(`http://localhost:${instance.address().port}/items`)
      .then(response => response.json())
      .then(actual => {
        assert.deepEqual(actual, [{id: 1}, {id: 2}]);
      });
  });

  it('Should handle route /items/:id withRoute()', () => {
    return fetch(`http://localhost:${instance.address().port}/items/1`)
      .then(response => response.json())
      .then(actual => {
        assert.deepEqual(actual, {id: 1});
      });
  });

  it('Should response 404 at route / withRoute()', () => {
    return fetch(
      `http://localhost:${instance.address().port}`
    ).then(response => {
      assert.equal(response.status, 404);
    });
  });
});
