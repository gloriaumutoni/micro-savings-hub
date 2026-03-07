'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');

const { notFound, errorHandler } = require('../src/middleware/errorHandler');

const makeMockRes = () => ({
  statusCode: null,
  body: null,
  status(code) { this.statusCode = code; return this; },
  json(data) { this.body = data; return this; },
});

test('notFound middleware responds with 404 and JSON error', () => {
  const res = makeMockRes();
  notFound({}, res);

  assert.strictEqual(res.statusCode, 404);
  assert.deepStrictEqual(res.body, { error: 'Route not found' });
});

test('errorHandler defaults to 500 for a generic Error', () => {
  const res = makeMockRes();
  errorHandler(new Error('boom'), {}, res, () => {});

  assert.strictEqual(res.statusCode, 500);
  assert.deepStrictEqual(res.body, { error: 'boom' });
});

test('errorHandler uses err.status when explicitly set', () => {
  const res = makeMockRes();
  const err = Object.assign(new Error('not found'), { status: 404 });
  errorHandler(err, {}, res, () => {});

  assert.strictEqual(res.statusCode, 404);
  assert.deepStrictEqual(res.body, { error: 'not found' });
});

test('errorHandler falls back to "Internal server error" when message is empty', () => {
  const res = makeMockRes();
  const err = Object.assign(new Error(''), { status: 503 });
  errorHandler(err, {}, res, () => {});

  assert.strictEqual(res.statusCode, 503);
  assert.deepStrictEqual(res.body, { error: 'Internal server error' });
});
