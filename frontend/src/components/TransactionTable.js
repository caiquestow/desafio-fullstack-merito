import React, { useState, useEffect } from 'react';
import { transactionsAPI } from '../services/api';

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await transactionsAPI.list();
      setTransactions(response.data);
    } catch (error) {
      console.error('Erro ao buscar transação:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-br', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  if (loading) return <div>Carregando transações...</div>;

  return (
    <div className="card">
      <div className="card-header">
        <h3>Transações Recentes</h3>
      </div>
      <div className="card-body">
        {transactions.length === 0 ? (
          <p>Nenhuma transação encontrada.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Fundo</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Qtde</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td>{formatDate(transaction.date)}</td>
                    <td>{transaction.fund_name}</td>
                    <td>
                      <span className={`badge ${
                        transaction.transaction_type === 'DEPOSIT' 
                          ? 'bg-success' 
                          : 'bg-danger'
                      }`}>
                        {transaction.transaction_type === 'DEPOSIT' ? 'Aporte' : 'Resgate'}
                      </span>
                    </td>
                    <td>{formatCurrency(transaction.amount)}</td>
                    <td>{parseFloat(transaction.shares_quantity).toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionTable;