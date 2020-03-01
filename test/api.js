const api = exports;


function call({method, url, header, body, expect}) {
  const app = require('../app');

  return $call({app, method, url, header, body, expect});
}


function $call({app, method, url, header, body, expect}) {
  const request = require('supertest');

  const $method = request(app)[method];
  if (header) $method.set(header);

  return $method(url).send(body).then(expect);
}


api.call = call;
