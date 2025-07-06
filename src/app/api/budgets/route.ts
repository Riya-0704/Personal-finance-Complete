import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { Budget } from '@/types'

export async function GET() {
  try {
    const db = await getDatabase()
    const budgets = await db
      .collection<Budget>('budgets')
      .find({})
      .sort({ month: -1, category: 1 })
      .toArray()

    return NextResponse.json(budgets)
  } catch (error) {
    console.error('Error fetching budgets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch budgets' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const budget: Omit<Budget, '_id'> = await request.json()
    
    // Validate required fields
    if (!budget.category || !budget.amount || !budget.month) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate amount is positive
    if (budget.amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      )
    }

    // Validate month format (YYYY-MM)
    if (!/^\d{4}-\d{2}$/.test(budget.month)) {
      return NextResponse.json(
        { error: 'Month must be in YYYY-MM format' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    
    // Check if budget already exists for this category and month
    const existingBudget = await db.collection<Budget>('budgets').findOne({
      category: budget.category,
      month: budget.month
    })

    if (existingBudget) {
      // Update existing budget
      const result = await db.collection<Budget>('budgets').updateOne(
        { _id: existingBudget._id },
        { $set: { amount: budget.amount } }
      )

      const updatedBudget = await db
        .collection<Budget>('budgets')
        .findOne({ _id: existingBudget._id })

      return NextResponse.json(updatedBudget)
    } else {
      // Create new budget
      const result = await db.collection<Budget>('budgets').insertOne(budget)

      const newBudget = await db
        .collection<Budget>('budgets')
        .findOne({ _id: result.insertedId })

      return NextResponse.json(newBudget, { status: 201 })
    }
  } catch (error) {
    console.error('Error creating/updating budget:', error)
    return NextResponse.json(
      { error: 'Failed to create/update budget' },
      { status: 500 }
    )
  }
}