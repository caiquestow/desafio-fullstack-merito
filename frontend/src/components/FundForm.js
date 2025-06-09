import React, { useState } from 'react';
import { fundsAPI } from '../services/api';

const FundForm = ({ onFundCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    ticker: '',
    fund_type: 'STOCK',
    share_price: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await fundsAPI.create(formData);
      alert('Fund created successfully!');
      setFormData({
        name: '',
        ticker: '',
        fund_type: 'STOCK',
        share_price: ''
      });
      onFundCreated();
    } catch (error) {
      alert('Error creating fund');
      console.error(error);
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
        <h3>Create New Fund</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Fund Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Ticker</label>
            <input
              type="text"
              className="form-control"
              name="ticker"
              value={formData.ticker}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Fund Type</label>
            <select
              className="form-control"
              name="fund_type"
              value={formData.fund_type}
              onChange={handleChange}
            >
              <option value="STOCK">Stock Fund</option>
              <option value="BOND">Bond Fund</option>
              <option value="MULTI">Multi Market</option>
            </select>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Share Price</label>
            <input
              type="number"
              step="0.0001"
              className="form-control"
              name="share_price"
              value={formData.share_price}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Fund'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FundForm;