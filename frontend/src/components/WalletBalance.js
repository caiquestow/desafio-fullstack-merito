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

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="row mb-4">
      <div className="col-md-4">
        <div className="card text-center">
          <div className="card-body">
            <h5 className="card-title">Saldo atual</h5>
            <h3 className="text-primary">
              ${balance?.balance?.toFixed(2) || '0.00'}
            </h3>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card text-center">
          <div className="card-body">
            <h5 className="card-title">Total Depositos</h5>
            <h4 className="text-success">
              ${balance?.total_deposits?.toFixed(2) || '0.00'}
            </h4>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card text-center">
          <div className="card-body">
            <h5 className="card-title">Total Saques</h5>
            <h4 className="text-danger">
              ${balance?.total_withdrawals?.toFixed(2) || '0.00'}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletBalance;