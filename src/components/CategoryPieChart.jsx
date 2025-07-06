import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const CategoryPieChart = ({ transactions, selectedMonth }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const COLORS = [
    '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', 
    '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#84cc16',
    '#06b6d4', '#6366f1', '#a855f7'
  ]

  // Filter transactions based on selected month and type
  const filteredTransactions = transactions.filter(t => {
    const transactionMonth = new Date(t.date).toISOString().slice(0, 7)
    return (!selectedMonth || transactionMonth === selectedMonth) && t.type === 'expense'
  })

  // Group by category
  const categoryData = filteredTransactions.reduce((acc, transaction) => {
    const existing = acc.find(item => item.category === transaction.category)
    if (existing) {
      existing.amount += transaction.amount
      existing.count += 1
    } else {
      acc.push({
        category: transaction.category,
        amount: transaction.amount,
        count: 1
      })
    }
    return acc
  }, [])

  const sortedData = categoryData.sort((a, b) => b.amount - a.amount)
  const totalExpenses = sortedData.reduce((sum, item) => sum + item.amount, 0)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const percentage = ((data.amount / totalExpenses) * 100).toFixed(1)
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{data.category}</p>
          <p className="tooltip-value">{formatCurrency(data.amount)}</p>
          <p className="tooltip-percentage">{percentage}% of total</p>
          <p className="tooltip-count">{data.count} transaction{data.count !== 1 ? 's' : ''}</p>
        </div>
      )
    }
    return null
  }

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null // Don't show labels for slices less than 5%
    
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  if (sortedData.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h2>Expenses by Category</h2>
        </div>
        <div className="empty-state">
          <p>No expense data available</p>
          <p className="empty-subtitle">Add some expense transactions to see the breakdown</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Expenses by Category</h2>
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
          <PieChart>
            <Pie
              data={sortedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="amount"
            >
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry) => (
                <span style={{ color: entry.color }}>
                  {value} ({formatCurrency(entry.payload.amount)})
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default CategoryPieChart

export { CategoryPieChart }