import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FundForm from './components/FundForm';
import TransactionForm from './components/TransactionForm';
import TransactionTable from './components/TransactionTable';
import WalletBalance from './components/WalletBalance';

function App() {
  const [activeTab, setActiveTab] = useState('wallet');
  const [refreshData, setRefreshData] = useState(0);

  const handleDataUpdate = () => {
    setRefreshData(prev => prev + 1);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Investment Dashboard</h1>
      
      {/* Navigation */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'wallet' ? 'active' : ''}`}
            onClick={() => setActiveTab('wallet')}
          >
            Wallet
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'funds' ? 'active' : ''}`}
            onClick={() => setActiveTab('funds')}
          >
            Funds
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
        </li>
      </ul>

      {/* Content */}
      {activeTab === 'wallet' && (
        <div>
          <WalletBalance key={refreshData} />
          <TransactionTable key={refreshData} />
        </div>
      )}
      
      {activeTab === 'funds' && (
        <FundForm onFundCreated={handleDataUpdate} />
      )}
      
      {activeTab === 'transactions' && (
        <TransactionForm onTransactionCreated={handleDataUpdate} />
      )}
    </div>
  );
}

export default App;