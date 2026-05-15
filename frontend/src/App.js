import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default function App() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${API}/agent/status`)
      .then(r => setStatus(r.data))
      .catch(() => setError('Backend unreachable'));
  }, []);

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>🌸 Orchid Agent Dashboard</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {status && (
        <>
          <p>Status: <strong>{status.status}</strong></p>
          <h2>Recent Activity</h2>
          {status.activities.length === 0
            ? <p>No activity yet.</p>
            : <ActivityTable rows={status.activities} />}
        </>
      )}
    </main>
  );
}

function ActivityTable({ rows }) {
  return (
    <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr><th>Type</th><th>Amount</th><th>Asset</th><th>Counterparty</th><th>Time</th></tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.id}>
            <td>{r.type}</td>
            <td>{r.amount}</td>
            <td>{r.asset}</td>
            <td>{r.counterparty}</td>
            <td>{new Date(r.ts).toLocaleTimeString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
