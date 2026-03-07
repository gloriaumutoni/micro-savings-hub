'use strict';

const request = require('supertest');
const app = require('../app');

const testEmail = `test_${Date.now()}@example.com`;
const testPassword = 'password123';
let authToken;

describe('POST /api/auth/register', () => {
  it('creates a new user and returns 201', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: testEmail,
      password: testPassword,
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toHaveProperty('email', testEmail);
    expect(res.body.data).not.toHaveProperty('password_hash');
  });

  it('returns 409 for duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: testEmail,
      password: testPassword,
    });
    expect(res.statusCode).toBe(409);
  });

  it('returns 400 when email is missing', async () => {
    const res = await request(app).post('/api/auth/register').send({ password: 'abc123' });
    expect(res.statusCode).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  it('returns a JWT token on valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password: testPassword,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('token');
    authToken = res.body.data.token;
  });

  it('returns 401 for wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password: 'wrongpassword',
    });
    expect(res.statusCode).toBe(401);
  });

  it('returns 400 when fields are missing', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: testEmail });
    expect(res.statusCode).toBe(400);
  });
});

describe('Protected route — GET /api/groups', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app).get('/api/groups');
    expect(res.statusCode).toBe(401);
  });

  it('returns 200 with a valid token', async () => {
    if (!authToken) {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: testEmail, password: testPassword });
      authToken = loginRes.body.data.token;
    }
    const res = await request(app).get('/api/groups').set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
