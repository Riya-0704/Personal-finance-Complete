# 💰 Personal Finance Visualizer

A full-stack web application to track personal finances, categorize spending, visualize expenses, and manage monthly budgets — all in one simple, modern dashboard.

### 🔗 Live Demo: Link 

---

## 📦 Features

### ✅ Stage 1: Basic Transaction Tracking
- Add / Edit / Delete transactions
- Monthly spending bar chart (Recharts)
- Summary cards: total income, expenses, balance
- Tab-based interface (Overview & Transactions)
- Clean, responsive UI using Tailwind CSS

### ✅ Stage 2: Categories
- Predefined categories: Food, Travel, Rent, etc.
- Category-based pie chart
- Filter by category or date
- Category-wise breakdown of spending

### ✅ Stage 3: Budgeting
- Set monthly budgets for each category
- Compare budget vs actual using charts
- Spending insights and color-coded alerts
- Visual cues for over/under budget status

---

## 🔧 Tech Stack

### Frontend
- ⚛️ React.js (Vite)
- 🎨 Tailwind CSS
- 📊 Recharts
- 🧩 shadcn/ui (for polished UI components)

### Backend
- 🖥️ Node.js + Express.js
- 🌐 MongoDB Atlas + Mongoose
- 🔐 dotenv, CORS
- 📤 REST API architecture

---

## 🌐 Deployment

- Hosted on [**Vercel**](https://vercel.com)
- Auto-deployed from GitHub via continuous integration


---

## 🧪 Running Locally

### 1. Clone the repository

git clone https://github.com/your-username/personal-finance-visualizer.git

2. Start the backend
cd server
npm install
npm start

4. Start the frontend
cd client
npm install
npm run dev

📌 Stage-wise Summary
Feature	Stage 1	Stage 2	Stage 3
Add/Edit/Delete Transactions	✅	✅	✅
Monthly Expense Bar Chart	✅	✅	✅
Summary Cards	✅	✅	✅
Category Support	❌	✅	✅
Pie Chart by Category	❌	✅	✅
Filter by Category	❌	✅	✅
Budget Input per Category	❌	❌	✅
Budget vs Actual Chart	❌	❌	✅
Overspending Warnings	❌	❌	✅

📄 License
This project is open-source and available under the MIT License.

🙌 Acknowledgements
Recharts – for elegant data visualization

Tailwind CSS – for modern UI design

MongoDB Atlas – for cloud database

Render & Vercel – for deployment

