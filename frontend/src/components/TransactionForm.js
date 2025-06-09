import React, { useState, useEffect } from 'react';
import { transactionsAPI, fundsAPI } from '../services/api';

const TransactionForm = ({ onTransactionCreated }) => {
  const [formData, setFormData] = useState({
    fund: '',
    date: '',
    amount: '',
    transaction_type: 'DEPOSIT',
    shares_quantity: ''
  });
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(false);

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
    
    try {
      await transactionsAPI.create(formData);
      alert('Transaction created successfully!');
      setFormData({
        fund: '',
        date: '',
        amount: '',
        transaction_type: 'DEPOSIT',
        shares_quantity: ''
      });
      onTransactionCreated();
    } catch (error) {
      alert('Erro ao criar transação');
    //   console.error(error);
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
                  {fund.ticker} - {fund.name}
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
              className="form-control"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Transaction Type</label>
            <select
              className="form-control"
              name="transaction_type"
              value={formData.transaction_type}
              onChange={handleChange}
            >
              <option value="DEPOSIT">Deposit</option>
              <option value="WITHDRAWAL">Withdrawal</option>
            </select>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Shares Quantity</label>
            <input
              type="number"
              step="0.0001"
              className="form-control"
              name="shares_quantity"
              value={formData.shares_quantity}
              onChange={handleChange}
              required
            />
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