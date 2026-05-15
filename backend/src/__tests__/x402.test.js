// Mock stellar SDK before requiring middleware
jest.mock('../stellar', () => ({
  StellarSdk: {
    verifyPayment: jest.fn().mockResolvedValue({ from: 'GABC', amount: '0.01', asset: 'USDC' }),
  },
}));

const { x402Middleware } = require('../middleware/x402');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

test('returns 402 when no payment header', async () => {
  const req = { headers: {} };
  const res = mockRes();
  await x402Middleware(req, res, jest.fn());
  expect(res.status).toHaveBeenCalledWith(402);
});

test('calls next when payment header is valid', async () => {
  const req = { headers: { 'x-payment': 'validtoken' } };
  const res = mockRes();
  const next = jest.fn();
  await x402Middleware(req, res, next);
  expect(next).toHaveBeenCalled();
  expect(req.payment).toMatchObject({ asset: 'USDC' });
});
