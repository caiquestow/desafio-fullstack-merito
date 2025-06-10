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
  const [selectedFund, setSelectedFund] = useState(null);
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

  const handleFundChange = (e) => {
    const fundId = e.target.value;
    setFormData({ ...formData, fund: fundId });
    
    if (fundId) {
      const fund = funds.find(f => f.id.toString() === fundId);
      setSelectedFund(fund);
    } else {
      setSelectedFund(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validação adicional no frontend
    if (formData.transaction_type === 'WITHDRAWAL' && selectedFund) {
      if (parseFloat(formData.amount) > selectedFund.current_balance) {
        setError(`Saldo insuficiente no fundo ${selectedFund.ticker}. Saldo disponível: R$ ${selectedFund.current_balance.toFixed(2)}`);
        setLoading(false);
        return;
      }
    }
    
    try {
      await transactionsAPI.create(formData);
      alert('Transação feita com sucesso!');
      setFormData({
        fund: '',
        date: '',
        amount: '',
        transaction_type: 'DEPOSIT'
      });
      setSelectedFund(null);
      onTransactionCreated();
      fetchFunds(); // Recarregar dados dos fundos
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
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
              onChange={handleFundChange}
              required
            >
              <option value="">Selecione um fundo</option>
              {funds.map(fund => (
                <option key={fund.id} value={fund.id}>
                  {fund.ticker} - {fund.name} ({formatCurrency(fund.share_price)}/cota)
                  {fund.current_balance > 0 && ` - Saldo: ${formatCurrency(fund.current_balance)}`}
                </option>
              ))}
            </select>
          </div>

          {/* Mostrar detalhes do fundo selecionado */}
          {selectedFund && (
            <div className="alert alert-info">
              <h6><strong>{selectedFund.ticker} - {selectedFund.name}</strong></h6>
              <div className="row">
                <div className="col-md-4">
                  <small>Saldo Disponível:</small><br/>
                  <strong>{formatCurrency(selectedFund.current_balance)}</strong>
                </div>
                <div className="col-md-4">
                  <small>Cotas Totais:</small><br/>
                  <strong>{selectedFund.current_shares.toFixed(4)}</strong>
                </div>
                <div className="col-md-4">
                  <small>Preço por Cota:</small><br/>
                  <strong>{formatCurrency(selectedFund.share_price)}</strong>
                </div>
              </div>
            </div>
          )}
          
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
              O número de cotas será calculado automaticamente conforme o valor do fundo.
              {formData.amount && selectedFund && (
                <div className="mt-1">
                  <strong>Cotas a serem {formData.transaction_type === 'DEPOSIT' ? 'compradas' : 'vendidas'}: </strong>
                  {(parseFloat(formData.amount || 0) / selectedFund.share_price).toFixed(4)}
                </div>
              )}
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
            {loading ? 'Processando...' : 'Fazer Transação'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;