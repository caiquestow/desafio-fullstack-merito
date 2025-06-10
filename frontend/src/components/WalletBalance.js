import React, { useState, useEffect } from 'react';
import { walletAPI } from '../services/api';

const WalletBalance = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await walletAPI.balance();
      setBalance(response.data);
    } catch (error) {
      console.error('Erro ao consultar saldo:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount || 0);
  };

  if (loading) return <div>Carregando saldos...</div>;

  return (
    <div>
      {/* Resumo Geral */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Saldo Total</h5>
              <h3 className="text-primary">
                {formatCurrency(balance?.balance)}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total Depósitos</h5>
              <h4 className="text-success">
                {formatCurrency(balance?.total_deposits)}
              </h4>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total Saques</h5>
              <h4 className="text-danger">
                {formatCurrency(balance?.total_withdrawals)}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Saldos por Fundo */}
      {balance?.funds_balance && balance.funds_balance.length > 0 && (
        <div className="card mb-4">
          <div className="card-header">
            <h5>Saldos por Fundo</h5>
          </div>
          <div className="card-body">
            <div className="row">
              {balance.funds_balance.map(fund => (
                <div key={fund.fund_id} className="col-md-6 col-lg-4 mb-3">
                  <div className="card border-secondary">
                    <div className="card-body">
                      <h6 className="card-title">
                        <strong>{fund.fund_ticker}</strong>
                      </h6>
                      <p className="card-text small text-muted">
                        {fund.fund_name}
                      </p>
                      
                      <div className="row text-center">
                        <div className="col-12 mb-2">
                          <small>Saldo Atual</small><br/>
                          <strong className="text-primary">
                            {formatCurrency(fund.balance)}
                          </strong>
                        </div>
                        <div className="col-6">
                          <small>Cotas</small><br/>
                          <strong>{fund.shares.toFixed(4)}</strong>
                        </div>
                        <div className="col-6">
                          <small>Preço/Cota</small><br/>
                          <strong>{formatCurrency(fund.share_price)}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {(!balance?.funds_balance || balance.funds_balance.length === 0) && (
        <div className="alert alert-info">
          <p className="mb-0">Nenhum investimento em fundos encontrado. Faça seu primeiro aporte!</p>
        </div>
      )}
    </div>
  );
};

export default WalletBalance;