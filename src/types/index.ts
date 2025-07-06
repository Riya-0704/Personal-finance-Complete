export interface Transaction {
  _id?: string
  amount: number
  description: string
  category: string
  date: Date
  type: 'income' | 'expense'
}

export interface Budget {
  _id?: string
  category: string
  amount: number
  month: string // Format: YYYY-MM
}

export interface CategorySummary {
  category: string
  amount: number
  count: number
}

export interface MonthlyData {
  month: string
  amount: number
}

export interface BudgetComparison {
  category: string
  budgeted: number
  actual: number
  remaining: number
  percentage: number
}