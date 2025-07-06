import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react'

const SummaryCards = ({ transactions, selectedMonth }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  // Filter transactions for selected month or current month if no selection
  const currentMonth = selectedMonth || new Date().toISOString().slice(0, 7)
  
  const monthTransactions = transactions.filter(t => {
    const transactionMonth = new Date(t.date).toISOString().slice(0, 7)
    return transactionMonth === currentMonth
  })
  
  const totalIncome = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpenses = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const netIncome = totalIncome - totalExpenses
  const transactionCount = monthTransactions.length

  const cards = [
    {
      title: 'Total Income',
      value: formatCurrency(totalIncome),
      icon: TrendingUp,
      type: 'income',
      subtitle: selectedMonth ? 
        new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) :
        'This month'
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(totalExpenses),
      icon: TrendingDown,
      type: 'expense',
      subtitle: selectedMonth ? 
        new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) :
        'This month'
    },
    {
      title: 'Net Income',
      value: formatCurrency(netIncome),
      icon: DollarSign,
      type: 'net',
      isPositive: netIncome >= 0,
      subtitle: selectedMonth ? 
        new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) :
        'This month'
    },
    {
      title: 'Transactions',
      value: transactionCount.toString(),
      icon: Activity,
      type: 'count',
      subtitle: selectedMonth ? 
        new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) :
        'This month'
    }
  ]

  return (
    <div className="summary-cards">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <div key={index} className="summary-card">
            <div className="summary-card-header">
              <span className="summary-card-title">{card.title}</span>
              <div className={`summary-card-icon ${card.type}`}>
                <Icon size={20} />
              </div>
            </div>
            <div className={`summary-card-value ${card.type} ${card.isPositive !== undefined ? (card.isPositive ? 'positive' : 'negative') : ''}`}>
              {card.value}
            </div>
            <div className="summary-card-subtitle">{card.subtitle}</div>
          </div>
        )
      })}
    </div>
  )
}

export default SummaryCards

export { SummaryCards }