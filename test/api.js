const api = exports;


function call({method, url, header, body, code=200, expect}) {
  const app = require('../app');

  return $call({app, method, url, header, body, code, expect});
}


function $call({app, method, url, header, body, code, expect}) {
  const request = require('supertest');

  const $method = request(app)[method];
  if (header) $method.set(header);

  return $method(url).send(body).expect(code).then(expect);
}


api.call = call;
