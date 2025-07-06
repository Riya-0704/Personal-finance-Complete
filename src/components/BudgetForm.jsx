import { useState } from 'react'
import { X, Target } from 'lucide-react'

const BudgetForm = ({ budget, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    category: budget?.category || '',
    amount: budget?.amount?.toString() || '',
    month: budget?.month || new Date().toISOString().slice(0, 7) // YYYY-MM format
  })

  const [errors, setErrors] = useState({})

  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Personal Care',
    'Home & Garden',
    'Insurance',
    'Other'
  ]

  const validateForm = () => {
    const newErrors = {}
    
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

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    onSubmit({
      category: formData.category,
      amount: parseFloat(formData.amount),
      month: formData.month
    })
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">
            <Target size={20} />
            <h2>{budget ? 'Edit Budget' : 'Set Budget'}</h2>
          </div>
          <button className="close-button" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Month</label>
            <input
              type="month"
              value={formData.month}
              onChange={(e) => handleChange('month', e.target.value)}
              className={errors.month ? 'error' : ''}
            />
            {errors.month && <span className="error-text">{errors.month}</span>}
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className={errors.category ? 'error' : ''}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <span className="error-text">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label>Budget Amount ($)</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              className={errors.amount ? 'error' : ''}
              placeholder="0.00"
            />
            {errors.amount && <span className="error-text">{errors.amount}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              {budget ? 'Update' : 'Set'} Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BudgetForm

export { BudgetForm }