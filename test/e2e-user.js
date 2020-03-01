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

  it('should success to login with valid password', async function() {
    const expect = res => {
      const { expect } = require('chai');

      expect(res.status).to.be.equal(200);
      expect(res.body.email).to.be.equal(user.email);
      expect(res.body.password).to.be.equal(undefined);

      return res.body;
    };

    await api.call({
      method: 'post',
      url: '/user/session',
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
});
