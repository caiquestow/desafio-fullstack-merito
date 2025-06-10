import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FundForm from './components/FundForm';
import TransactionForm from './components/TransactionForm';
import TransactionTable from './components/TransactionTable';
import WalletBalance from './components/WalletBalance';

function App() {
  const [activeTab, setActiveTab] = useState('wallet');
  const [reload, setReload] = useState(0);

  const handleDataUpdate = () => {
    setReload(prev => prev + 1);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Dashboard de investimentos</h1>
      
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'wallet' ? 'active' : ''}`}
            onClick={() => setActiveTab('wallet')}
          >
            Carteira
          </button>
        </li>
        {/* <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'funds' ? 'active' : ''}`}
            onClick={() => setActiveTab('funds')}
          >
            Fundos
          </button>
        </li> */}
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            Compra/Venda
          </button>
        </li>
      </ul>

      {activeTab === 'wallet' && (
        <div>
          <WalletBalance key={reload} />
          <TransactionTable key={reload} />
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