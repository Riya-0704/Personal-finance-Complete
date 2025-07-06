import { useState } from 'react'
import { Edit, Trash2, Search, List } from 'lucide-react'

const TransactionList = ({ transactions, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all') // 'all', 'income', 'expense'
  const [filterCategory, setFilterCategory] = useState('all')
  const [dateRange, setDateRange] = useState('all') // 'all', 'week', 'month', 'year'

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date))
  }

  // Get unique categories from transactions
  const allCategories = [...new Set(transactions.map(t => t.category))].filter(Boolean).sort()

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter(transaction => {
    // Search filter
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Type filter
    const matchesType = filterType === 'all' || transaction.type === filterType
    
    // Category filter
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory
    
    // Date range filter
    let matchesDate = true
    if (dateRange !== 'all') {
      const transactionDate = new Date(transaction.date)
      const now = new Date()
      
      switch (dateRange) {
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          matchesDate = transactionDate >= weekAgo
          break
        case 'month':
          const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
          matchesDate = transactionDate >= monthAgo
          break
        case 'year':
          const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
          matchesDate = transactionDate >= yearAgo
          break
      }
    }
    
    return matchesSearch && matchesType && matchesCategory && matchesDate
  })

  const sortedTransactions = [...filteredTransactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="transaction-list-container">
      {/* Header with title and description */}
      <div className="transaction-header">
        <div className="transaction-title">
          <List size={20} />
          <h2>Transaction History</h2>
        </div>
        <p className="transaction-subtitle">Manage your income and expense transactions</p>
      </div>

      {/* Search and Filters */}
      <div className="transaction-filters">
        <div className="search-section">
          <label className="filter-label">Search transactions</label>
          <div className="search-input-container">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <label className="filter-label">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              {allCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="transaction-list">
        {sortedTransactions.length === 0 ? (
          <div className="empty-state">
            {transactions.length === 0 ? (
              <>
                <p>No transactions yet</p>
                <p className="empty-subtitle">Add your first transaction to get started</p>
              </>
            ) : (
              <>
                <p>No transactions found</p>
                <p className="empty-subtitle">Try adjusting your search or filters</p>
              </>
            )}
          </div>
        ) : (
          sortedTransactions.map((transaction) => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-info">
                <div className={`transaction-indicator ${transaction.type}`}></div>
                <div className="transaction-details">
                  <p className="transaction-description" title={transaction.description}>
                    {transaction.description}
                  </p>
                  <div className="transaction-meta">
                    <span className={`transaction-type-badge ${transaction.type}`}>
                      {transaction.type}
                    </span>
                    {transaction.category && (
                      <>
                        <span>•</span>
                        <span className="transaction-category">{transaction.category}</span>
                      </>
                    )}
                    <span>•</span>
                    <span className="transaction-date">{formatDate(transaction.date)}</span>
                  </div>
                </div>
              </div>
              
              <div className="transaction-actions">
                <span className={`transaction-amount ${transaction.type}`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </span>
                
                <div className="action-buttons">
                  <button
                    className="action-button edit"
                    onClick={() => onEdit(transaction)}
                    title="Edit transaction"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="action-button delete"
                    onClick={() => onDelete(transaction.id)}
                    title="Delete transaction"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Results count */}
      {sortedTransactions.length > 0 && (
        <div className="results-count">
          Showing {sortedTransactions.length} of {transactions.length} transactions
        </div>
      )}
    </div>
  )
}

export default TransactionList