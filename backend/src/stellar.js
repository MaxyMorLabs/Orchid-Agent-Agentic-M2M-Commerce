const stellar = require('@stellar/stellar-sdk');

const server = new stellar.Horizon.Server(
  process.env.STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org'
);

const StellarSdk = {
  /**
   * Verify an x402 payment header (base64-encoded signed XDR envelope).
   * Returns parsed payment info or throws.
   */
  async verifyPayment(paymentHeader) {
    const xdr = Buffer.from(paymentHeader, 'base64').toString('utf8');
    const tx = stellar.TransactionBuilder.fromXDR(xdr, stellar.Networks.TESTNET);
    // Minimal check: transaction has at least one payment operation
    const op = tx.operations.find(o => o.type === 'payment');
    if (!op) throw new Error('No payment operation found');
    return { from: tx.source, amount: op.amount, asset: op.asset.code };
  },

  /**
   * Submit a signed XDR transaction to Stellar network.
   */
  async submitTransaction(xdr) {
    const tx = stellar.TransactionBuilder.fromXDR(xdr, stellar.Networks.TESTNET);
    return server.submitTransaction(tx);
  },

  server,
  stellar,
};

module.exports = { StellarSdk };
