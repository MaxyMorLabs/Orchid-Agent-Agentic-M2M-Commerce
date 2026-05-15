require('dotenv').config();
const express = require('express');
const { agentRouter } = require('./routes/agent');
const { paymentRouter } = require('./routes/payment');

const app = express();
app.use(express.json());

app.get('/health', (_, res) => res.json({ status: 'ok' }));
app.use('/agent', agentRouter);
app.use('/payment', paymentRouter);

const PORT = process.env.PORT || 3001;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Orchid Agent running on :${PORT}`));
}

module.exports = { app };
