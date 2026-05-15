const { StellarSdk } = require('../stellar');

/**
 * x402 middleware: responds with 402 if no valid payment header,
 * otherwise verifies the USDC payment on Stellar and proceeds.
 */
async function x402Middleware(req, res, next) {
  const paymentHeader = req.headers['x-payment'];
  if (!paymentHeader) {
    return res.status(402).json({
      error: 'Payment Required',
      accepts: [{
        scheme: 'x402',
        network: 'stellar',
        asset: 'USDC',
        amount: process.env.SERVICE_PRICE_USDC || '0.01',
        payTo: process.env.AGENT_PUBLIC_KEY,
      }],
    });
  }

  try {
    const verified = await StellarSdk.verifyPayment(paymentHeader);
    if (!verified) return res.status(402).json({ error: 'Invalid payment' });
    req.payment = verified;
    next();
  } catch (err) {
    res.status(402).json({ error: 'Payment verification failed', detail: err.message });
  }
}

module.exports = { x402Middleware };
