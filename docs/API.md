# API Documentation

## Base URL
\`\`\`
Production: https://your-app.vercel.app/api
Development: http://localhost:3000/api
\`\`\`

## Authentication

All protected endpoints require JWT token in Authorization header:
\`\`\`
Authorization: Bearer <jwt_token>
\`\`\`

### Register User
\`\`\`http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "password123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here"
}
\`\`\`

### Login User
\`\`\`http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
\`\`\`

## Transactions

### Get All Transactions
\`\`\`http
GET /api/transactions
Authorization: Bearer <token>
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "transactions": [
    {
      "id": 1,
      "type": "income",
      "amount": "5000.00",
      "category": "Salary",
      "description": "Monthly salary",
      "date": "2024-01-15",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
\`\`\`

### Create Transaction
\`\`\`http
POST /api/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "expense",
  "amount": 150.50,
  "category": "Food",
  "description": "Grocery shopping",
  "date": "2024-01-15"
}
\`\`\`

### Update Transaction
\`\`\`http
PUT /api/transactions/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 200.00,
  "description": "Updated description"
}
\`\`\`

### Delete Transaction
\`\`\`http
DELETE /api/transactions/1
Authorization: Bearer <token>
\`\`\`

## Debts

### Get All Debts
\`\`\`http
GET /api/debts
Authorization: Bearer <token>
\`\`\`

### Create Debt
\`\`\`http
POST /api/debts
Authorization: Bearer <token>
Content-Type: application/json

{
  "creditor_name": "Bank ABC",
  "amount": 10000.00,
  "due_date": "2024-12-31",
  "description": "Car loan"
}
\`\`\`

### Mark Debt as Paid
\`\`\`http
POST /api/debts/1/mark-paid
Authorization: Bearer <token>
\`\`\`

## Savings Goals

### Get All Savings Goals
\`\`\`http
GET /api/savings
Authorization: Bearer <token>
\`\`\`

### Create Savings Goal
\`\`\`http
POST /api/savings
Authorization: Bearer <token>
Content-Type: application/json

{
  "goal_name": "Emergency Fund",
  "target_amount": 50000.00,
  "target_date": "2024-12-31",
  "description": "6 months emergency fund"
}
\`\`\`

### Update Savings Progress
\`\`\`http
POST /api/savings/1/update-progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 1000.00,
  "action": "add"
}
\`\`\`

## Export

### Export to Excel
\`\`\`http
POST /api/export/excel
Authorization: Bearer <token>
Content-Type: application/json

{
  "includeTransactions": true,
  "includeDebts": true,
  "includeSavings": true,
  "startDate": "2024-01-01",
  "endDate": "2024-12-31"
}
\`\`\`

**Response:** Excel file download

## Error Responses

All endpoints return consistent error format:

\`\`\`json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
\`\`\`

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
