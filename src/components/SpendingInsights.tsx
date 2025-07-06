"use client"

import { Transaction, Budget } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { AlertTriangle, TrendingUp, Target, CheckCircle } from 'lucide-react'

interface SpendingInsightsProps {
  transactions: Transaction[]
  budgets: Budget[]
}

export function SpendingInsights({ transactions, budgets }: SpendingInsightsProps) {
  const currentMonth = new Date().toISOString().slice(0, 7)
  const currentMonthBudgets = budgets.filter(b => b.month === currentMonth)
  
  const insights = []

  // Budget alerts
  currentMonthBudgets.forEach(budget => {
    const actualSpent = transactions
      .filter(t => {
        const transactionMonth = new Date(t.date).toISOString().slice(0, 7)
        return transactionMonth === currentMonth && 
               t.category === budget.category && 
               t.type === 'expense'
      })
      .reduce((sum, t) => sum + t.amount, 0)
    
    const percentage = budget.amount > 0 ? (actualSpent / budget.amount) * 100 : 0
    
    if (percentage > 100) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: `Over budget in ${budget.category}`,
        description: `You've spent ${formatCurrency(actualSpent)} out of ${formatCurrency(budget.amount)} (${percentage.toFixed(0)}% over budget)`,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      })
    } else if (percentage > 80) {
      insights.push({
        type: 'caution',
        icon: AlertTriangle,
        title: `Approaching budget limit in ${budget.category}`,
        description: `You've spent ${formatCurrency(actualSpent)} out of ${formatCurrency(budget.amount)} (${percentage.toFixed(0)}% of budget)`,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      })
    } else if (percentage > 0) {
      insights.push({
        type: 'good',
        icon: CheckCircle,
        title: `On track with ${budget.category}`,
        description: `You've spent ${formatCurrency(actualSpent)} out of ${formatCurrency(budget.amount)} (${percentage.toFixed(0)}% of budget)`,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      })
    }
  })

  // Top spending category
  const currentMonthExpenses = transactions.filter(t => {
    const transactionMonth = new Date(t.date).toISOString().slice(0, 7)
    return transactionMonth === currentMonth && t.type === 'expense'
  })

  const categoryTotals = currentMonthExpenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount
    return acc
  }, {} as Record<string, number>)

  const topCategory = Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)[0]

  if (topCategory) {
    insights.push({
      type: 'info',
      icon: TrendingUp,
      title: `Highest spending category: ${topCategory[0]}`,
      description: `You've spent ${formatCurrency(topCategory[1])} in this category this month`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    })
  }

  // Categories without budgets
  const categoriesWithoutBudgets = Object.keys(categoryTotals).filter(category => 
    !currentMonthBudgets.some(budget => budget.category === category)
  )

  if (categoriesWithoutBudgets.length > 0) {
    insights.push({
      type: 'suggestion',
      icon: Target,
      title: 'Consider setting budgets',
      description: `You have expenses in ${categoriesWithoutBudgets.length} categories without budgets: ${categoriesWithoutBudgets.slice(0, 3).join(', ')}${categoriesWithoutBudgets.length > 3 ? '...' : ''}`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    })
  }

  if (insights.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Spending Insights</h2>
        <div className="text-center text-gray-500 py-8">
          <p className="text-lg font-medium">No insights available</p>
          <p className="text-sm">Add more transactions and budgets to get personalized insights</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Spending Insights</h2>
      <div className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon
          return (
            <div
              key={index}
              className={`p-4 rounded-lg border ${insight.borderColor} ${insight.bgColor}`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`h-5 w-5 ${insight.color} mt-0.5 flex-shrink-0`} />
                <div>
                  <h3 className={`font-medium ${insight.color}`}>
                    {insight.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}