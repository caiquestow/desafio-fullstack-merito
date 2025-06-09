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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) return <div>Loading transactions...</div>;

  return (
    <div className="card">
      <div className="card-header">
        <h3>Recent Transactions</h3>
      </div>
      <div className="card-body">
        {transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Fund</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Shares</th>
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
                        {transaction.transaction_type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}
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