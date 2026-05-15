const { Router } = require('express');
const { v4: uuidv4 } = require('uuid');

const agentRouter = Router();

// In-memory activity log (replace with DB in production)
const activities = [];

agentRouter.get('/status', (_, res) => {
  res.json({ agent: 'orchid', status: 'running', activities: activities.slice(-20) });
});

agentRouter.post('/activity', (req, res) => {
  const { type, amount, counterparty, asset = 'USDC' } = req.body;
  if (!type || !amount || !counterparty) {
    return res.status(400).json({ error: 'type, amount, counterparty required' });
  }
  const entry = { id: uuidv4(), type, amount, asset, counterparty, ts: Date.now() };
  activities.push(entry);
  res.status(201).json(entry);
});

module.exports = { agentRouter };
