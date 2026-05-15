const { Router } = require('express');
const { x402Middleware } = require('../middleware/x402');

const paymentRouter = Router();

// Protected endpoint: agent pays to access supplier data
paymentRouter.get('/data', x402Middleware, (req, res) => {
  res.json({
    message: 'Access granted via x402 payment',
    payment: req.payment,
    data: { inventory: [{ sku: 'ITEM-001', qty: 100, price: '1.50' }] },
  });
});

// Webhook: called by Stellar after on-chain settlement
paymentRouter.post('/webhook', (req, res) => {
  const { txHash, from, amount } = req.body;
  console.log(`[webhook] tx=${txHash} from=${from} amount=${amount} USDC`);
  res.json({ received: true });
});

module.exports = { paymentRouter };
