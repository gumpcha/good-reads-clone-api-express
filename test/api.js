const api = exports;


function call({method, url, auth, body, code=200, expect}) {
  const app = require('../app');

  return $call({app, method, url, auth, body, code, expect});
}


function $call({app, method, url, auth, body, code, expect}) {
  const request = require('supertest');

  const $method = request(app)[method](url);
  if (auth) $method.set('authorization', `Bearer ${auth}`);

  return $method.send(body).expect(code).then(expect);
}


api.call = call;
