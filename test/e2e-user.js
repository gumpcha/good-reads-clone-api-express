const api = require('./api');
const UserService = require('../services/user');

describe('users', () => {
  const user = {
    email: 'test@email.com',
    password: 'password',
  };

  it('prepare: cleanup test user', async function() {
    await UserService.deleteByEmail(user.email);
  });

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

  it('should signup fail to same email', async function() {
    const expect = res => {
      const { expect } = require('chai');

      expect(res.status).to.be.equal(409);
      expect(res.body.code).to.be.equal(409);
      expect(res.body.message).to.be.equal('already signed_up');

      return res.body;
    };

    await api.call({
      method: 'post',
      url: '/user',
      body: {
        email: user.email,
        password: user.password,
      },
      code: 409,
      expect,
    });
  });


  it('should fail to login with invalid password', async function() {
    const expect = res => {
      const { expect } = require('chai');

      expect(res.status).to.be.equal(401);
      expect(res.body.code).to.be.equal(401);
      expect(res.body.message).to.be.equal('email/password mismatch(1)');

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

  it('should success to logout', async function () {
    const expect = res => {
      const { expect } = require('chai');

      expect(res.status).to.be.equal(200);
      expect(res.body.code).to.be.equal(200);
      expect(res.body.message).to.be.equal('OK');

      return res.body;
    };

    await api.call({
      method: 'delete',
      url: '/user/session',
      auth: user.access_token,
      expect,
    });
  });

  it('should fail to query profile after logout', async function () {
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
      auth: user.access_token,
      code: 401,
      expect,
    });
  });

  context('signout', () => {
    it('should success to login', async function() {
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

    it('should success to signout', async function () {
      const expect = res => {
        const { expect } = require('chai');

        expect(res.status).to.be.equal(200);
        expect(res.body.code).to.be.equal(200);
        expect(res.body.message).to.be.equal('OK');

        return res.body;
      };

      await api.call({
        method: 'delete',
        url: '/user',
        auth: user.access_token,
        expect,
      });
    });

    it('should fail to login after signout', async function () {
      const expect = res => {
        const { expect } = require('chai');

        expect(res.status).to.be.equal(401);
        expect(res.body.code).to.be.equal(401);
        expect(res.body.message).to.be.equal('email/password mismatch(0)');

        return res.body;
      };

      await api.call({
        method: 'post',
        url: '/user/session',
        body: {
          email: user.email,
          password: user.password,
        },
        code: 401,
        expect,
      });
    });
  });
});
