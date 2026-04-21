# Zerodha Stock Trading Dashboard


<img width="1419" height="727" alt="image" src="https://github.com/user-attachments/assets/a900a17c-a4ba-4f07-9b5a-a121a738145c" />

A full-stack real-time stock trading platform built with **React**, **Node.js**, **Express**, **MongoDB**, and **Socket.io**. Features live market data, buy/sell operations, portfolio management, and payment integration with Stripe.

## Features

✅ **Real-Time Stock Data** - Live price updates every 2 seconds via WebSocket  
✅ **Buy/Sell Orders** - Place and manage stock orders with live pricing  
✅ **Portfolio Management** - Track holdings, orders, and positions  
✅ **Market Analytics** - Interactive price charts and sector breakdown  
✅ **Watchlist** - Add favorite stocks for quick access  
✅ **Payment Integration** - Stripe integration for balance top-ups  
✅ **Live Dashboard** - Real-time balance and portfolio updates  
✅ **Responsive Design** - Works on desktop and mobile  
✅ **Authentication** - JWT-based user login and registration  

## Tech Stack

### Frontend
- **React 18** with Vite v5.4.21 (build tool)
- **Material-UI** (icons and components)
- **Chart.js** with react-chartjs-2 (data visualization)
- **Socket.io** (real-time updates)
- **Stripe.js** (payment processing)
- **Context API** (state management)

### Backend
- **Node.js** + **Express.js**
- **MongoDB** with Mongoose ORM
- **Socket.io** (real-time communication)
- **JWT** (authentication)
- **Stripe API** (payments)
- **bcrypt** (password hashing)

## Project Structure

```
Zerodha/
├── backend/
│   ├── model/              # MongoDB schemas
│   ├── schemas/            # Mongoose schemas
│   ├── index.js            # Main server file
│   ├── package.json        # Dependencies
│   └── .env                # Environment variables
├── dashboard/              # Main trading dashboard
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── css/            # Component-scoped styles
│   │   ├── data/           # Static data
│   │   ├── api.js          # API calls
│   │   ├── RealTimeContext.jsx  # Real-time data provider
│   │   └── index.jsx       # App entry
│   ├── package.json
│   └── vite.config.js
├── frontend/               # Landing page & auth
│   ├── src/
│   │   ├── landing_page/   # Home, signup, login
│   │   ├── pages/          # Dashboard page
│   │   └── index.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Installation

### Prerequisites
- Node.js 16+ and npm
- MongoDB Atlas account (or local MongoDB)
- Stripe account for payment processing

### 1. Clone and Install Dependencies

```bash
# Backend
cd backend
npm install

# Dashboard
cd ../dashboard
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Setup Environment Variables

**Backend (.env):**
```env
PORT=5000
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/zerodha?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

**Dashboard (.env):**
```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000
```

## Running the Application

### Terminal 1: Backend Server
```bash
cd backend
npm start
# or with nodemon for auto-reload
nodemon index.js
```
Server runs on `http://localhost:5000`

### Terminal 2: Dashboard
```bash
cd dashboard
npm run dev
```
Dashboard runs on `http://localhost:3003` (auto-rotates based on availability)

### Terminal 3: Frontend (Landing Page)
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:3000` or `http://localhost:3001`

## Key Features Explained

### Real-Time Market Data
- **Socket.io Connection**: Automatic connection to WebSocket for live price updates
- **Polling Fallback**: Switches to HTTP polling if WebSocket fails
- **Price Simulation**: Backend simulates realistic price movements for 50 NIFTY stocks
- **Update Frequency**: Market prices broadcast every 2 seconds

### Portfolio Management
- **Holdings**: Track all purchased stocks with quantity and average cost
- **Orders**: History of all buy/sell transactions
- **Positions**: Real-time P&L calculation
- **Balance**: Available cash balance with Stripe top-up option

### Charts & Analytics
- **Interactive Charts**: Price history with Chart.js
- **Sector Breakdown**: Doughnut chart showing holdings by sector
- **Market Analysis**: High, low, and change % for each stock

## API Endpoints

### Authentication
- `POST /signup` - User registration
- `POST /login` - User login (returns JWT)

### Holdings & Portfolio
- `GET /holdings` - Get user holdings
- `GET /positions` - Get positions summary
- `GET /orders` - Get order history

### Trading
- `POST /orders` - Place buy/sell order
- `PUT /orders/:id` - Update order

### Market Data
- `GET /marketPrices` - Get all 50 stock prices
- `GET /indices` - Get NIFTY50 & SENSEX data

### Payment
- `POST /create-payment-intent` - Create Stripe payment
- `POST /add-balance` - Add funds to account

## MongoDB Collections

- **users**: User accounts with credentials and balance
- **holdings**: User stock holdings
- **orders**: Buy/sell order history
- **positions**: Summary positions
- **favorites**: Watchlist stocks
- **tickets**: Support tickets

## Real-Time Architecture

```
Client (Dashboard)
    ↓
Socket.io Connection
    ↓
Backend Server
    ↓
Database (MongoDB)
    ↓
Market Data Simulation
    ↓
Broadcast to All Connected Clients
```

## CSS Architecture

All component styles are organized in separate CSS files within `dashboard/src/css/`:
- `Global.css` - Utility classes (flex, grid, spacing, colors)
- `Summary.css`, `Holdings.css`, `Orders.css`, etc. - Component-specific styles
- `index.css` - Global element styles only

## Deployment

### Backend
```bash
npm run build
npm start
```
Deploy to Heroku, Railway, Render, or any Node.js hosting

### Frontend/Dashboard
```bash
npm run build
# Deploy dist/ folder to Vercel, Netlify, or any static host
```

## Troubleshooting

### MongoDB Connection Issues
- Verify Atlas credentials in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure `retryWrites=true&w=majority` in connection string

### Socket.io Connection Failed
- Check backend CORS settings
- Verify frontend API URL matches backend
- Check browser console for errors

### Stripe Payment Errors
- Verify Stripe keys are correct
- Use test cards: `4242 4242 4242 4242`
- Check webhook configuration

## License

This project is for educational purposes.

## Author

Built as a full-stack trading platform demo.
# EquityX
