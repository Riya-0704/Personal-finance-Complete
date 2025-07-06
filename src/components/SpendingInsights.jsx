import { AlertTriangle, TrendingUp, Target, CheckCircle, DollarSign } from 'lucide-react'

const SpendingInsights = ({ transactions, budgets, selectedMonth }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const generateInsights = () => {
    const insights = []
    
    // Filter transactions for selected month
    const monthTransactions = transactions.filter(t => {
      const transactionMonth = new Date(t.date).toISOString().slice(0, 7)
      return (!selectedMonth || transactionMonth === selectedMonth) && t.type === 'expense'
    })

    const monthBudgets = budgets.filter(b => 
      !selectedMonth || b.month === selectedMonth
    )

    // Budget alerts
    monthBudgets.forEach(budget => {
      const actualSpent = monthTransactions
        .filter(t => t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0)
      
      const percentage = budget.amount > 0 ? (actualSpent / budget.amount) * 100 : 0
      
      if (percentage > 100) {
        insights.push({
          type: 'warning',
          icon: AlertTriangle,
          title: `Over budget in ${budget.category}`,
          description: `You've spent ${formatCurrency(actualSpent)} out of ${formatCurrency(budget.amount)} (${percentage.toFixed(0)}% over budget)`,
          color: 'red'
        })
      } else if (percentage > 80) {
        insights.push({
          type: 'caution',
          icon: AlertTriangle,
          title: `Approaching budget limit in ${budget.category}`,
          description: `You've spent ${formatCurrency(actualSpent)} out of ${formatCurrency(budget.amount)} (${percentage.toFixed(0)}% of budget)`,
          color: 'yellow'
        })
      }
    })

    // Top spending category
    const categoryTotals = monthTransactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {})

    const topCategory = Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)[0]

    if (topCategory) {
      insights.push({
        type: 'info',
        icon: TrendingUp,
        title: `Highest spending: ${topCategory[0]}`,
        description: `You've spent ${formatCurrency(topCategory[1])} in this category`,
        color: 'blue'
      })
    }

    // Categories without budgets
    const categoriesWithoutBudgets = Object.keys(categoryTotals).filter(category => 
      !monthBudgets.some(budget => budget.category === category)
    )

    if (categoriesWithoutBudgets.length > 0) {
      insights.push({
        type: 'suggestion',
        icon: Target,
        title: 'Consider setting budgets',
        description: `You have expenses in ${categoriesWithoutBudgets.length} categories without budgets: ${categoriesWithoutBudgets.slice(0, 3).join(', ')}${categoriesWithoutBudgets.length > 3 ? '...' : ''}`,
        color: 'purple'
      })
    }

    // Positive insights for categories under budget
    const underBudgetCategories = monthBudgets.filter(budget => {
      const actualSpent = monthTransactions
        .filter(t => t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0)
      return actualSpent < budget.amount * 0.8 && actualSpent > 0
    })

    if (underBudgetCategories.length > 0) {
      const category = underBudgetCategories[0]
      const actualSpent = monthTransactions
        .filter(t => t.category === category.category)
        .reduce((sum, t) => sum + t.amount, 0)
      const saved = category.amount - actualSpent
      
      insights.push({
        type: 'success',
        icon: CheckCircle,
        title: `Great job on ${category.category}!`,
        description: `You're ${formatCurrency(saved)} under budget this month`,
        color: 'green'
      })
    }

    return insights
  }

  const insights = generateInsights()

  if (insights.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h2>Spending Insights</h2>
        </div>
        <div className="empty-state">
          <DollarSign size={48} className="empty-icon" />
          <p>No insights available</p>
          <p className="empty-subtitle">Add more transactions and budgets to get personalized insights</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Spending Insights</h2>
        {selectedMonth && (
          <p className="card-subtitle">
            {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        )}
      </div>
      <div className="insights-container">
        {insights.map((insight, index) => {
          const Icon = insight.icon
          return (
            <div key={index} className={`insight-item ${insight.color}`}>
              <div className="insight-icon">
                <Icon size={20} />
              </div>
              <div className="insight-content">
                <h3 className="insight-title">{insight.title}</h3>
                <p className="insight-description">{insight.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SpendingInsights

export { SpendingInsights }