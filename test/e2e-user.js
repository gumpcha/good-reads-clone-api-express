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
      expect(res.body.access_token).to.match(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);

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
      expect(res.body.access_token).to.match(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);

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
    user.access_token = res.access_token;
  });

  it('should fail to query profile with invalid access_token', async function () {
    const expect = res => {
      const { expect } = require('chai');

      expect(res.status).to.be.equal(401);
      expect(res.body.code).to.be.equal(401);
      expect(res.body.message).to.be.equal('invalid access_token');

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

  it('should success to query profile with valid access_token', async function () {
    const expect = res => {
      const { expect } = require('chai');

      expect(res.status).to.be.equal(200);
      expect(res.body.email).to.be.equal(user.email);
      expect(res.body.password).to.be.equal(undefined);
      expect(res.body.access_token).to.be.equal(undefined);

      return res.body;
    };

    await api.call({
      method: 'get',
      url: '/user',
      auth: user.access_token,
      expect,
    });
  });
});
