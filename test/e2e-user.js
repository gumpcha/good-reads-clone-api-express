const api = require('./api');

describe('users', () => {
  const user = {
    email: 'test@email.com',
    password: 'password',
  };

  it('should signup', async function() {
    const expect = res => {
      const { expect } = require('chai');

      expect(res.status).to.be.equal(200);
      expect(res.body.email).to.be.equal(user.email);
      expect(res.body.password).to.be.equal(undefined);
      expect(res.body.api_key).to.match(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);

      return res.body;
    };

    await api.call({
      method: 'post',
      url: '/user',
      body: {
        email: user.email,
        password: user.password,
      },
      expect,
    });
  });

  it('should fail to login with invalid password', async function() {
    const expect = res => {
      const { expect } = require('chai');

      expect(res.status).to.be.equal(401);
      expect(res.body.code).to.be.equal(401);
      expect(res.body.message).to.be.equal('email/password mismatch');

      return res.body;
    };

    await api.call({
      method: 'post',
      url: '/user/session',
      body: {
        email: user.email,
        password: 'invalid password',
      },
      code: 401,
      expect,
    });
  });

  it('should success to login with valid password', async function() {
    const expect = res => {
      const { expect } = require('chai');

      expect(res.status).to.be.equal(200);
      expect(res.body.email).to.be.equal(user.email);
      expect(res.body.password).to.be.equal(undefined);
      expect(res.body.api_key).to.match(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);

      return res.body;
    };

    const res = await api.call({
      method: 'post',
      url: '/user/session',
      body: {
        email: user.email,
        password: user.password,
      },
      expect,
    });
    user.api_key = res.api_key;
  });

  it('should fail to query profile with invalid api_key', async function () {
    const expect = res => {
      const { expect } = require('chai');

      expect(res.status).to.be.equal(401);
      expect(res.body.code).to.be.equal(401);
      expect(res.body.message).to.be.equal('invalid api_key');

      return res.body;
    };

    await api.call({
      method: 'get',
      url: '/user',
      auth: 'invalid api-key',
      code: 401,
      expect,
    });
  });

  it('should success to query profile with valid api_key', async function () {
    const expect = res => {
      const { expect } = require('chai');

      expect(res.status).to.be.equal(200);
      expect(res.body.email).to.be.equal(user.email);
      expect(res.body.password).to.be.equal(undefined);
      expect(res.body.api_key).to.be.equal(undefined);

      return res.body;
    };

    await api.call({
      method: 'get',
      url: '/user',
      auth: user.api_key,
      expect,
    });
  });
});
