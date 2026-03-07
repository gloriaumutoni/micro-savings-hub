'use strict';

const request = require('supertest');
const app = require('../app');

const email1 = `owner_${Date.now()}@example.com`;
const email2 = `member_${Date.now()}@example.com`;
const password = 'password123';
let ownerToken;
let memberToken;
let groupId;
let inviteToken;

async function loginAs(email, pw) {
  const res = await request(app).post('/api/auth/login').send({ email, password: pw });
  return res.body.data.token;
}

beforeAll(async () => {
  // Register two users
  await request(app).post('/api/auth/register').send({ email: email1, password });
  await request(app).post('/api/auth/register').send({ email: email2, password });

  ownerToken = await loginAs(email1, password);
  memberToken = await loginAs(email2, password);
});

describe('POST /api/groups', () => {
  it('creates a group and returns 201', async () => {
    const res = await request(app)
      .post('/api/groups')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ name: 'Test Group', targetAmount: 100000, currency: 'RWF' });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toHaveProperty('userRole', 'owner');
    groupId = res.body.data.id;
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(app)
      .post('/api/groups')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ targetAmount: 5000 });
    expect(res.statusCode).toBe(400);
  });
});

describe('GET /api/groups — user scoping', () => {
  it('returns only groups the user belongs to', async () => {
    const res = await request(app)
      .get('/api/groups')
      .set('Authorization', `Bearer ${memberToken}`);
    expect(res.statusCode).toBe(200);
    const ids = res.body.data.map((g) => g.id);
    expect(ids).not.toContain(groupId);
  });

  it('owner sees their group', async () => {
    const res = await request(app)
      .get('/api/groups')
      .set('Authorization', `Bearer ${ownerToken}`);
    expect(res.statusCode).toBe(200);
    const ids = res.body.data.map((g) => g.id);
    expect(ids).toContain(groupId);
  });
});

describe('POST /api/groups/:id/invite + POST /api/groups/join/:token', () => {
  it('owner generates an invite', async () => {
    const res = await request(app)
      .post(`/api/groups/${groupId}/invite`)
      .set('Authorization', `Bearer ${ownerToken}`);
    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('token');
    inviteToken = res.body.data.token;
  });

  it('non-owner cannot generate an invite', async () => {
    const res = await request(app)
      .post(`/api/groups/${groupId}/invite`)
      .set('Authorization', `Bearer ${memberToken}`);
    expect(res.statusCode).toBe(403);
  });

  it('member joins via invite token', async () => {
    const res = await request(app)
      .post(`/api/groups/join/${inviteToken}`)
      .set('Authorization', `Bearer ${memberToken}`);
    expect(res.statusCode).toBe(200);
  });

  it('used token returns 410', async () => {
    const res = await request(app)
      .post(`/api/groups/join/${inviteToken}`)
      .set('Authorization', `Bearer ${memberToken}`);
    expect(res.statusCode).toBe(410);
  });
});

describe('POST /api/groups/:id/contribute', () => {
  it('member can contribute', async () => {
    const res = await request(app)
      .post(`/api/groups/${groupId}/contribute`)
      .set('Authorization', `Bearer ${memberToken}`)
      .send({ amount: 5000 });
    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('amount');
  });

  it('returns 400 for invalid amount', async () => {
    const res = await request(app)
      .post(`/api/groups/${groupId}/contribute`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ amount: -100 });
    expect(res.statusCode).toBe(400);
  });
});

describe('GET /api/groups/:id', () => {
  it('member can view group detail', async () => {
    const res = await request(app)
      .get(`/api/groups/${groupId}`)
      .set('Authorization', `Bearer ${memberToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('contributions');
    expect(res.body.data).toHaveProperty('progress');
  });
});
