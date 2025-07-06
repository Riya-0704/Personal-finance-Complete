import { useState, useEffect } from 'react'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import MonthlyExpensesChart from './components/MonthlyExpensesChart'
import CategoryPieChart from './components/CategoryPieChart'
import BudgetForm from './components/BudgetForm'
import BudgetList from './components/BudgetList'
import BudgetVsActualChart from './components/BudgetVsActualChart'
import SpendingInsights from './components/SpendingInsights'
import SummaryCards from './components/SummaryCards'
import { Plus, Wallet, BarChart3, List, Target, PieChart, TrendingUp } from 'lucide-react'
import './App.css'

function App() {
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState([])
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false)
  const [isBudgetFormOpen, setIsBudgetFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [editingBudget, setEditingBudget] = useState(null)
  const [activeTab, setActiveTab] = useState('overview') // 'overview', 'transactions', 'budgets', 'analytics'
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)) // YYYY-MM format

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions')
    const savedBudgets = localStorage.getItem('budgets')
    
    if (savedTransactions) {
      try {
        const parsed = JSON.parse(savedTransactions)
        setTransactions(parsed)
      } catch (error) {
        console.error('Error loading transactions:', error)
        setTransactions([])
      }
    }

    if (savedBudgets) {
      try {
        const parsed = JSON.parse(savedBudgets)
        setBudgets(parsed)
      } catch (error) {
        console.error('Error loading budgets:', error)
        setBudgets([])
      }
    }
  }, [])

  // Save data to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets))
  }, [budgets])

  const handleAddTransaction = (transactionData) => {
    const newTransaction = {
      id: Date.now().toString(),
      ...transactionData,
      date: new Date(transactionData.date),
      createdAt: new Date()
    }
    setTransactions(prev => [newTransaction, ...prev])
    setIsTransactionFormOpen(false)
  }

  const handleEditTransaction = (transactionData) => {
    setTransactions(prev => 
      prev.map(t => 
        t.id === editingTransaction.id 
          ? { 
              ...editingTransaction, 
              ...transactionData, 
              date: new Date(transactionData.date),
              updatedAt: new Date()
            }
          : t
      )
    )
    setEditingTransaction(null)
    setIsTransactionFormOpen(false)
  }

  const handleDeleteTransaction = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(prev => prev.filter(t => t.id !== id))
    }
  }

  const handleAddBudget = (budgetData) => {
    const newBudget = {
      id: Date.now().toString(),
      ...budgetData,
      createdAt: new Date()
    }
    setBudgets(prev => [newBudget, ...prev])
    setIsBudgetFormOpen(false)
  }

  const handleEditBudget = (budgetData) => {
    setBudgets(prev => 
      prev.map(b => 
        b.id === editingBudget.id 
          ? { 
              ...editingBudget, 
              ...budgetData,
              updatedAt: new Date()
            }
          : b
      )
    )
    setEditingBudget(null)
    setIsBudgetFormOpen(false)
  }

  const handleDeleteBudget = (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      setBudgets(prev => prev.filter(b => b.id !== id))
    }
  }

  const openEditTransactionForm = (transaction) => {
    setEditingTransaction(transaction)
    setIsTransactionFormOpen(true)
  }

  const openEditBudgetForm = (budget) => {
    setEditingBudget(budget)
    setIsBudgetFormOpen(true)
  }

  const closeTransactionForm = () => {
    setIsTransactionFormOpen(false)
    setEditingTransaction(null)
  }

  const closeBudgetForm = () => {
    setIsBudgetFormOpen(false)
    setEditingBudget(null)
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-title">
            <div className="header-icon">
              <Wallet size={24} />
            </div>
            <div>
              <h1>Personal Finance Tracker</h1>
              <p>Track your income, expenses, and budgets with ease</p>
            </div>
          </div>
          
          <div className="header-actions">
            <button 
              className="add-button secondary"
              onClick={() => setIsBudgetFormOpen(true)}
            >
              <Target size={16} />
              Set Budget
            </button>
            <button 
              className="add-button"
              onClick={() => setIsTransactionFormOpen(true)}
            >
              <Plus size={16} />
              Add Transaction
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Summary Cards - Always visible at the top */}
        <div className="summary-section">
          <SummaryCards transactions={transactions} selectedMonth={selectedMonth} />
        </div>

        {/* Month Selector */}
        <div className="month-selector">
          <label htmlFor="month-select">View data for:</label>
          <input
            id="month-select"
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="month-input"
          />
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <BarChart3 size={18} />
            Overview
          </button>
          <button
            className={`tab-button ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            <List size={18} />
            Transactions
          </button>
          <button
            className={`tab-button ${activeTab === 'budgets' ? 'active' : ''}`}
            onClick={() => setActiveTab('budgets')}
          >
            <Target size={18} />
            Budgets
          </button>
          <button
            className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <TrendingUp size={18} />
            Analytics
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="charts-grid">
                <MonthlyExpensesChart transactions={transactions} />
                <CategoryPieChart transactions={transactions} selectedMonth={selectedMonth} />
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="transactions-tab">
              <TransactionList
                transactions={transactions}
                onEdit={openEditTransactionForm}
                onDelete={handleDeleteTransaction}
              />
            </div>
          )}

          {activeTab === 'budgets' && (
            <div className="budgets-tab">
              <BudgetList
                budgets={budgets}
                transactions={transactions}
                onEdit={openEditBudgetForm}
                onDelete={handleDeleteBudget}
                selectedMonth={selectedMonth}
              />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="analytics-tab">
              <div className="analytics-grid">
                <BudgetVsActualChart 
                  budgets={budgets} 
                  transactions={transactions} 
                  selectedMonth={selectedMonth} 
                />
                <SpendingInsights 
                  transactions={transactions} 
                  budgets={budgets} 
                  selectedMonth={selectedMonth} 
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Transaction Form Modal */}
      {isTransactionFormOpen && (
        <TransactionForm
          transaction={editingTransaction}
          onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
          onCancel={closeTransactionForm}
        />
      )}

      {/* Budget Form Modal */}
      {isBudgetFormOpen && (
        <BudgetForm
          budget={editingBudget}
          onSubmit={editingBudget ? handleEditBudget : handleAddBudget}
          onCancel={closeBudgetForm}
        />
      )}
    </div>
  )
}

export default App