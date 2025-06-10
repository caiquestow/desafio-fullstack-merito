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
      alert('Transação feita com sucesso!');
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
        setError('Erro ao fazer transação');
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
        <h3>Fazer Nova Transação</h3>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Fundo</label>
            <select
              className="form-control"
              name="fund"
              value={formData.fund}
              onChange={handleChange}
              required
            >
              <option value="">Selecione um fundo</option>
              {funds.map(fund => (
                <option key={fund.id} value={fund.id}>
                  {fund.ticker} - {fund.name} (R${fund.share_price}/cota)
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Data</label>
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
            <label className="form-label">Valor (R$)</label>
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
              O numero de cotas será calculado automaticamente conforme o valor do fundo.
            </div>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Tipo da transação</label>
            <select
              className="form-control"
              name="transaction_type"
              value={formData.transaction_type}
              onChange={handleChange}
            >
              <option value="DEPOSIT">Comprar (cotas)</option>
              <option value="WITHDRAWAL">Vender (cotas)</option>
            </select>
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Criando...' : 'Fazer Transação'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;