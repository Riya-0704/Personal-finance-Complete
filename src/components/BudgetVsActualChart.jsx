import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const BudgetVsActualChart = ({ budgets, transactions, selectedMonth }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  // Filter budgets for selected month
  const monthBudgets = budgets.filter(budget => 
    !selectedMonth || budget.month === selectedMonth
  )

  // Calculate actual spending for each budget category
  const chartData = monthBudgets.map(budget => {
    const actualSpent = transactions
      .filter(t => {
        const transactionMonth = new Date(t.date).toISOString().slice(0, 7)
        return (!selectedMonth || transactionMonth === budget.month) &&
               t.category === budget.category && 
               t.type === 'expense'
      })
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      category: budget.category,
      budget: budget.amount,
      actual: actualSpent,
      remaining: Math.max(0, budget.amount - actualSpent),
      overage: Math.max(0, actualSpent - budget.amount)
    }
  })

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const budget = payload.find(p => p.dataKey === 'budget')?.value || 0
      const actual = payload.find(p => p.dataKey === 'actual')?.value || 0
      const percentage = budget > 0 ? (actual / budget) * 100 : 0
      
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-budget">Budget: {formatCurrency(budget)}</p>
          <p className="tooltip-actual">Actual: {formatCurrency(actual)}</p>
          <p className="tooltip-percentage">
            {percentage.toFixed(1)}% of budget used
          </p>
        </div>
      )
    }
    return null
  }

  if (chartData.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h2>Budget vs Actual</h2>
        </div>
        <div className="empty-state">
          <p>No budget data available</p>
          <p className="empty-subtitle">Set some budgets to track your spending</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Budget vs Actual Spending</h2>
        {selectedMonth && (
          <p className="card-subtitle">
            {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        )}
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="category" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="budget" 
              fill="#3b82f6"
              name="Budget"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="actual" 
              fill="#ef4444"
              name="Actual"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default BudgetVsActualChart