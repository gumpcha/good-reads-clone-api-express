const api = require('./api');

describe('users', () => {
  it('should signup', async function() {
    const expect = res => {
      const { expect } = require('chai');

      expect(res.status).to.be.equal(200);
      expect(res.body.email).to.be.equal('test@email.com');
      expect(res.body.password).to.be.equal(undefined);

      return res.body;
    };

    await api.call({
      method: 'post',
      url: '/user',
      body: {
        email: 'test@email.com',
        password: 'password',
      },
      expect,
    });
  });
});
