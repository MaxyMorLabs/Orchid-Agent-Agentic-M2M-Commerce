const request = require('supertest');
const { app } = require('../index');

describe('GET /health', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('GET /agent/status', () => {
  it('returns agent status', async () => {
    const res = await request(app).get('/agent/status');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'running');
    expect(Array.isArray(res.body.activities)).toBe(true);
  });
});

describe('POST /agent/activity', () => {
  it('creates an activity entry', async () => {
    const res = await request(app)
      .post('/agent/activity')
      .send({ type: 'buy', amount: '10.00', counterparty: 'SUPPLIER-A' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ type: 'buy', amount: '10.00', asset: 'USDC' });
  });

  it('rejects missing fields', async () => {
    const res = await request(app).post('/agent/activity').send({ type: 'buy' });
    expect(res.status).toBe(400);
  });
});

describe('GET /payment/data (x402)', () => {
  it('returns 402 without payment header', async () => {
    const res = await request(app).get('/payment/data');
    expect(res.status).toBe(402);
    expect(res.body).toHaveProperty('accepts');
  });
});
