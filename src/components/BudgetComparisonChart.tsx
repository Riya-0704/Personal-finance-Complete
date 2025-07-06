"use client"

import { Transaction, Budget, BudgetComparison } from '@/types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface BudgetComparisonChartProps {
  transactions: Transaction[]
  budgets: Budget[]
}

export function BudgetComparisonChart({ transactions, budgets }: BudgetComparisonChartProps) {
  const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format
  
  const currentMonthBudgets = budgets.filter(b => b.month === currentMonth)
  
  const comparisonData: BudgetComparison[] = currentMonthBudgets.map(budget => {
    const actualSpent = transactions
      .filter(t => {
        const transactionMonth = new Date(t.date).toISOString().slice(0, 7)
        return transactionMonth === currentMonth && 
               t.category === budget.category && 
               t.type === 'expense'
      })
      .reduce((sum, t) => sum + t.amount, 0)
    
    const remaining = Math.max(0, budget.amount - actualSpent)
    const percentage = budget.amount > 0 ? (actualSpent / budget.amount) * 100 : 0
    
    return {
      category: budget.category,
      budgeted: budget.amount,
      actual: actualSpent,
      remaining,
      percentage
    }
  })

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const budgeted = payload.find((p: any) => p.dataKey === 'budgeted')?.value || 0
      const actual = payload.find((p: any) => p.dataKey === 'actual')?.value || 0
      const percentage = budgeted > 0 ? (actual / budgeted) * 100 : 0
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-blue-600">Budgeted: {formatCurrency(budgeted)}</p>
          <p className="text-red-600">Actual: {formatCurrency(actual)}</p>
          <p className="text-gray-600 text-sm">
            {percentage.toFixed(1)}% of budget used
          </p>
        </div>
      )
    }
    return null
  }

  if (comparisonData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Budget vs Actual</h2>
        <div className="h-80 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <p className="text-lg font-medium">No budgets set for this month</p>
            <p className="text-sm">Set some budgets to track your spending</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Budget vs Actual</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
              dataKey="budgeted" 
              fill="#3b82f6"
              name="Budgeted"
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