import React, { useState, useEffect } from 'react';
import { transactionsAPI, fundsAPI } from '../services/api';

const TransactionForm = ({ onTransactionCreated }) => {
  const [formData, setFormData] = useState({
    fund: '',
    date: '',
    amount: '',
    transaction_type: 'DEPOSIT'
  });
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFunds();
  }, []);

  const fetchFunds = async () => {
    try {
      const response = await fundsAPI.list();
      setFunds(response.data);
    } catch (error) {
      console.error('Erro ao consultar fundos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await transactionsAPI.create(formData);
      alert('Transaction created successfully!');
      setFormData({
        fund: '',
        date: '',
        amount: '',
        transaction_type: 'DEPOSIT'
      });
      onTransactionCreated();
    } catch (error) {
      if (error.response?.data) {
        const errorMsg = Object.values(error.response.data).flat().join(', ');
        setError(errorMsg);
      } else {
        setError('Erro ao criar transação');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>Create New Transaction</h3>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Fund</label>
            <select
              className="form-control"
              name="fund"
              value={formData.fund}
              onChange={handleChange}
              required
            >
              <option value="">Select a fund</option>
              {funds.map(fund => (
                <option key={fund.id} value={fund.id}>
                  {fund.ticker} - {fund.name} (${fund.share_price}/share)
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Amount ($)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              className="form-control"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
            <div className="form-text">
              The number of shares will be calculated automatically based on the fund's current price.
            </div>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Transaction Type</label>
            <select
              className="form-control"
              name="transaction_type"
              value={formData.transaction_type}
              onChange={handleChange}
            >
              <option value="DEPOSIT">Deposit (Buy shares)</option>
              <option value="WITHDRAWAL">Withdrawal (Sell shares)</option>
            </select>
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;