**Expense Tracker API**

A secure, scalable, and well-documented Express.js backend for tracking expenses, budgets, categories, and analytics. Built with Bun and TypeScript, featuring modern best practices and integrations:

- **Authentication & Authorization:** Clerk
- **Validation & Schemas:** Zod
- **Security:** Helmet, express-rate-limit
- **Documentation:** Swagger UI Express
- **Environment Management:** `.env` via `env.example.txt`

---

## 🚀 Features

- **Category Management:** CRUD for expense categories
- **Expense Management:** Full CRUD + search and filters
- **Budgeting:** Track multiple budgets with status checks
- **Analytics & Reports:** Summaries, monthly/yearly breakdowns, category-wise analysis, trends
- **Pagination & Sorting:** Flexible querying on expenses
- **API Documentation:** Interactive Swagger UI

---

## 📦 Tech Stack

- Runtime: **Bun**
- Language: **TypeScript**
- Framework: **Express.js**
- Authentication: **Clerk** (`@clerk/express`)
- Validation: **Zod**
- Security: **Helmet**, **express-rate-limit**
- API Docs: **swagger-ui-express**, **swagger-themes**
- Database: MongoDB (via Mongoose)

---

## 🔧 Prerequisites

- Node.js (>=18) / Bun
- MongoDB instance
- Clerk account & API keys

---

## ⚙️ Setup & Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Aymenbachiri/expense-tracker-backend-express.git
   cd expense-tracker-api
   ```

2. **Install dependencies** using Bun:

   ```bash
   bun install
   ```

3. **Environment variables**
   - Copy `.env.example.txt` to `.env`
   - Populate the required keys (Mongo URI, Clerk keys.)

   ```bash
   cp env.example.txt .env
   ```

4. **Run the application**:

   ```bash
   bun dev
   ```
   - The server will start on the port specified in `.env` `3000`.

---

## 📖 API Endpoints

### Category Endpoints

| Method | URL                   | Description             |
| ------ | --------------------- | ----------------------- |
| GET    | `/api/categories`     | Get all categories      |
| POST   | `/api/categories`     | Create a new category   |
| GET    | `/api/categories/:id` | Get a specific category |
| PUT    | `/api/categories/:id` | Update a category       |
| DELETE | `/api/categories/:id` | Delete a category       |

### Expense Endpoints

| Method | URL                             | Description                               |
| ------ | ------------------------------- | ----------------------------------------- |
| GET    | `/api/expenses`                 | Get all expenses (supports query filters) |
| POST   | `/api/expenses`                 | Create a new expense                      |
| GET    | `/api/expenses/:id`             | Get a specific expense                    |
| PUT    | `/api/expenses/:id`             | Update an expense                         |
| DELETE | `/api/expenses/:id`             | Delete an expense                         |
| GET    | `/api/expenses/search`          | Search expenses by description/notes      |
| GET    | `/api/expenses/by-category/:id` | Get expenses by category                  |

#### Query Parameters for `GET /api/expenses`

- `startDate=YYYY-MM-DD` — Filter by start date
- `endDate=YYYY-MM-DD` — Filter by end date
- `category=categoryId` — Filter by category
- `minAmount=number` — Minimum amount filter
- `maxAmount=number` — Maximum amount filter
- `page=number` — Page number (pagination)
- `limit=number` — Items per page
- `sortBy=date|amount|category` — Field to sort by
- `sortOrder=asc|desc` — Sort direction

### Budget Endpoints

| Method | URL                       | Description                        |
| ------ | ------------------------- | ---------------------------------- |
| GET    | `/api/budgets`            | Get all budgets for user           |
| POST   | `/api/budgets`            | Create a new budget                |
| GET    | `/api/budgets/:id`        | Get a specific budget              |
| PUT    | `/api/budgets/:id`        | Update a budget                    |
| DELETE | `/api/budgets/:id`        | Delete a budget                    |
| GET    | `/api/budgets/:id/status` | Get budget status (spent vs limit) |

### Analytics & Reports

| Method | URL                            | Description                          |
| ------ | ------------------------------ | ------------------------------------ |
| GET    | `/api/analytics/summary`       | Expense summary (total, by category) |
| GET    | `/api/analytics/monthly`       | Monthly expense breakdown            |
| GET    | `/api/analytics/yearly`        | Yearly expense breakdown             |
| GET    | `/api/analytics/category-wise` | Category-wise spending analysis      |
| GET    | `/api/analytics/trends`        | Spending trends over time            |

---

## 📋 Swagger Documentation

Access the interactive API docs at:

```
http://localhost:3000/api-docs
```

---

**Happy Tracking!**
