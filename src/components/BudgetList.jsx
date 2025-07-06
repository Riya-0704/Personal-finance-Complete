import { useState } from 'react'
import { Edit, Trash2, Target, AlertTriangle, CheckCircle } from 'lucide-react'

const BudgetList = ({ budgets, transactions, onEdit, onDelete, selectedMonth }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const getBudgetStatus = (budget) => {
    const monthTransactions = transactions.filter(t => {
      const transactionMonth = new Date(t.date).toISOString().slice(0, 7)
      return transactionMonth === budget.month && 
             t.category === budget.category && 
             t.type === 'expense'
    })

    const spent = monthTransactions.reduce((sum, t) => sum + t.amount, 0)
    const remaining = budget.amount - spent
    const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0

    return {
      spent,
      remaining,
      percentage,
      isOverBudget: spent > budget.amount
    }
  }

  const filteredBudgets = budgets.filter(budget => 
    !selectedMonth || budget.month === selectedMonth
  )

  if (filteredBudgets.length === 0) {
    return (
      <div className="empty-state">
        <Target size={48} className="empty-icon" />
        <p>No budgets set for this period</p>
        <p className="empty-subtitle">Set your first budget to start tracking your spending</p>
      </div>
    )
  }

  return (
    <div className="budget-list">
      {filteredBudgets.map((budget) => {
        const status = getBudgetStatus(budget)
        return (
          <div key={budget.id} className="budget-item">
            <div className="budget-info">
              <div className="budget-header">
                <h3 className="budget-category">{budget.category}</h3>
                <div className="budget-month">
                  {new Date(budget.month + '-01').toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </div>
              </div>
              
              <div className="budget-amounts">
                <div className="budget-amount">
                  <span className="amount-label">Budget</span>
                  <span className="amount-value">{formatCurrency(budget.amount)}</span>
                </div>
                <div className="budget-amount">
                  <span className="amount-label">Spent</span>
                  <span className={`amount-value ${status.isOverBudget ? 'over-budget' : ''}`}>
                    {formatCurrency(status.spent)}
                  </span>
                </div>
                <div className="budget-amount">
                  <span className="amount-label">Remaining</span>
                  <span className={`amount-value ${status.remaining < 0 ? 'over-budget' : 'remaining'}`}>
                    {formatCurrency(status.remaining)}
                  </span>
                </div>
              </div>

              <div className="budget-progress">
                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${status.isOverBudget ? 'over-budget' : ''}`}
                    style={{ width: `${Math.min(status.percentage, 100)}%` }}
                  ></div>
                </div>
                <div className="progress-info">
                  <span className={`progress-percentage ${status.isOverBudget ? 'over-budget' : ''}`}>
                    {status.percentage.toFixed(1)}%
                  </span>
                  <div className="progress-status">
                    {status.isOverBudget ? (
                      <div className="status-indicator over-budget">
                        <AlertTriangle size={16} />
                        Over Budget
                      </div>
                    ) : (
                      <div className="status-indicator on-track">
                        <CheckCircle size={16} />
                        On Track
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="budget-actions">
              <button
                className="action-button edit"
                onClick={() => onEdit(budget)}
                title="Edit budget"
              >
                <Edit size={16} />
              </button>
              <button
                className="action-button delete"
                onClick={() => onDelete(budget.id)}
                title="Delete budget"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default BudgetList