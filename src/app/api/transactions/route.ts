import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { Transaction } from '@/types'

export async function GET() {
  try {
    const db = await getDatabase()
    const transactions = await db
      .collection<Transaction>('transactions')
      .find({})
      .sort({ date: -1 })
      .toArray()

    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const transaction: Omit<Transaction, '_id'> = await request.json()
    
    // Validate required fields
    if (!transaction.amount || !transaction.description || !transaction.category || !transaction.date || !transaction.type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate amount is positive
    if (transaction.amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      )
    }

    // Validate type
    if (!['income', 'expense'].includes(transaction.type)) {
      return NextResponse.json(
        { error: 'Type must be either income or expense' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const result = await db.collection<Transaction>('transactions').insertOne({
      ...transaction,
      date: new Date(transaction.date)
    })

    const newTransaction = await db
      .collection<Transaction>('transactions')
      .findOne({ _id: result.insertedId })

    return NextResponse.json(newTransaction, { status: 201 })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    )
  }
}