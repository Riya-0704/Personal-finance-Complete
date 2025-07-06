"use client"

import { useState, useEffect } from 'react'
import { Transaction, Budget } from '@/types'
import { TransactionForm } from '@/components/TransactionForm'
import { TransactionList } from '@/components/TransactionList'
import { SummaryCards } from '@/components/SummaryCards'
import { MonthlyExpensesChart } from '@/components/MonthlyExpensesChart'
import { CategoryPieChart } from '@/components/CategoryPieChart'
import { BudgetForm } from '@/components/BudgetForm'
import { BudgetComparisonChart } from '@/components/BudgetComparisonChart'
import { SpendingInsights } from '@/components/SpendingInsights'
import { useToast } from '@/components/ui/use-toast'
import { Plus, Target, Wallet, BarChart3, PieChart, TrendingUp } from 'lucide-react'

export default function Home() {
  const { toast } = useToast()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false)
  const [isBudgetFormOpen, setIsBudgetFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>()
  const [editingBudget, setBudget] = useState<Budget | undefined>()
  const [isLoading, setIsLoading] = useState(true)

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions')
      if (!response.ok) throw new Error('Failed to fetch transactions')
      const data = await response.json()
      setTransactions(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      })
    }
  }

  // Fetch budgets
  const fetchBudgets = async () => {
    try {
      const response = await fetch('/api/budgets')
      if (!response.ok) throw new Error('Failed to fetch budgets')
      const data = await response.json()
      setBudgets(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch budgets",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await Promise.all([fetchTransactions(), fetchBudgets()])
      setIsLoading(false)
    }
    loadData()
  }, [])

  // Handle transaction submission
  const handleTransactionSubmit = async (transactionData: Omit<Transaction, '_id'>) => {
    try {
      if (editingTransaction) {
        // Update existing transaction
        const response = await fetch(`/api/transactions/${editingTransaction._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transactionData),
        })
        if (!response.ok) throw new Error('Failed to update transaction')
        
        setEditingTransaction(undefined)
        setIsTransactionFormOpen(false)
      } else {
        // Create new transaction
        const response = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transactionData),
        })
        if (!response.ok) throw new Error('Failed to create transaction')
      }
      
      await fetchTransactions()
    } catch (error) {
      throw error // Re-throw to be handled by the form
    }
  }

  // Handle budget submission
  const handleBudgetSubmit = async (budgetData: Omit<Budget, '_id'>) => {
    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budgetData),
      })
      if (!response.ok) throw new Error('Failed to create/update budget')
      
      setBudget(undefined)
      setIsBudgetFormOpen(false)
      await fetchBudgets()
    } catch (error) {
      throw error // Re-throw to be handled by the form
    }
  }

  // Handle transaction deletion
  const handleTransactionDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return
    
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete transaction')
      
      toast({
        title: "Transaction deleted",
        description: "Transaction has been successfully deleted",
      })
      
      await fetchTransactions()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      })
    }
  }

  // Handle transaction editing
  const handleTransactionEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setIsTransactionFormOpen(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your financial data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Personal Finance</h1>
                <p className="text-gray-600">Track and visualize your finances</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setIsBudgetFormOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <Target className="h-4 w-4" />
                Set Budget
              </button>
              <button
                onClick={() => setIsTransactionFormOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="h-4 w-4" />
                Add Transaction
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Summary Cards */}
          <SummaryCards transactions={transactions} />

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <MonthlyExpensesChart transactions={transactions} />
            <CategoryPieChart transactions={transactions} />
          </div>

          {/* Budget and Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <BudgetComparisonChart transactions={transactions} budgets={budgets} />
            <SpendingInsights transactions={transactions} budgets={budgets} />
          </div>

          {/* Transaction List */}
          <TransactionList
            transactions={transactions}
            onEdit={handleTransactionEdit}
            onDelete={handleTransactionDelete}
          />
        </div>
      </main>

      {/* Forms */}
      <TransactionForm
        transaction={editingTransaction}
        onSubmit={handleTransactionSubmit}
        onCancel={() => {
          setEditingTransaction(undefined)
          setIsTransactionFormOpen(false)
        }}
        isOpen={isTransactionFormOpen}
      />

      <BudgetForm
        budget={editingBudget}
        onSubmit={handleBudgetSubmit}
        onCancel={() => {
          setBudget(undefined)
          setIsBudgetFormOpen(false)
        }}
        isOpen={isBudgetFormOpen}
      />
    </div>
  )
}