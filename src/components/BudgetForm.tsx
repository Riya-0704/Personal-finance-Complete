"use client"

import { useState } from 'react'
import { Budget } from '@/types'
import { EXPENSE_CATEGORIES } from '@/lib/categories'
import { useToast } from '@/components/ui/use-toast'
import { X, Target, Edit3 } from 'lucide-react'

interface BudgetFormProps {
  budget?: Budget
  onSubmit: (budget: Omit<Budget, '_id'>) => Promise<void>
  onCancel: () => void
  isOpen: boolean
}

export function BudgetForm({ budget, onSubmit, onCancel, isOpen }: BudgetFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    category: budget?.category || '',
    amount: budget?.amount?.toString() || '',
    month: budget?.month || new Date().toISOString().slice(0, 7) // YYYY-MM format
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    }
    
    if (!formData.month) {
      newErrors.month = 'Month is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      await onSubmit({
        category: formData.category,
        amount: parseFloat(formData.amount),
        month: formData.month
      })
      
      toast({
        title: budget ? "Budget updated" : "Budget set",
        description: `Successfully ${budget ? 'updated' : 'set'} budget for ${formData.category}`,
      })
      
      if (!budget) {
        setFormData({
          category: '',
          amount: '',
          month: new Date().toISOString().slice(0, 7)
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${budget ? 'update' : 'set'} budget`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            {budget ? <Edit3 className="h-5 w-5 text-blue-600" /> : <Target className="h-5 w-5 text-green-600" />}
            <h2 className="text-xl font-semibold">
              {budget ? 'Edit Budget' : 'Set Budget'}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={!!budget} // Disable editing category for existing budgets
            >
              <option value="">Select category</option>
              {EXPENSE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Month
            </label>
            <input
              type="month"
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.month ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.month && <p className="text-red-500 text-sm mt-1">{errors.month}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                budget
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? 'Saving...' : budget ? 'Update Budget' : 'Set Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}