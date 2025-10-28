# 🚀 Soltip - Complete Setup Guide

A production-ready Solana USDC tipping dApp for creators.

---

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- Solana wallet (Phantom/Solflare)
- Circle account (for USDC transfers)

---

## 🔧 Environment Setup

### Server Setup (`/server`)

Create `/server/.env`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/soltip
# OR for production MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/soltip

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_REFRESH_SECRET=your_refresh_secret_minimum_32_characters
JWT_EXPIRY=30m
JWT_REFRESH_EXPIRY=7d

# Circle Payment Processing (Sandbox)
CIRCLE_SANDBOX_API_URL=https://api-sandbox.circle.com
CIRCLE_SANDBOX_API_KEY=your_circle_api_key
CIRCLE_SANDBOX_ENTITY_SECRET=your_circle_entity_secret
CIRCLE_SANDBOX_WEBHOOK_SECRET=your_webhook_secret
CIRCLE_SANDBOX_WEBHOOK_URL=https://your-domain.com/api/webhooks/circle
CIRCLE_SANDBOX_WALLET_SET_ID=your_wallet_set_id
CIRCLE_SANDBOX_USDC_TOKEN_ID=your_usdc_token_id

# Solana Configuration
SOLANA_RPC_URL=https://api.devnet.solana.com
USDC_MINT_ADDRESS=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
```

### Client Setup (`/client`)

Create `/client/.env.local`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

---

## 🛠️ Installation

```bash
# Install dependencies for both client and server
npm install

# Client
cd client
npm install

# Server
cd ../server
npm install
```

---

## 🚀 Running the Application

### Development Mode

From the root directory:

```bash
npm run dev
```

This starts:
- Client: http://localhost:5173
- Server: http://localhost:3000

### Production Mode

```bash
# Build client
cd client
npm run build

# Start server
cd ../server
npm start
```

---

## 🌐 Key URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api/v1
- **Health Check**: http://localhost:3000

---

## 📁 Project Structure

```
soltip/
├── client/              # React + TypeScript frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React contexts
│   │   ├── lib/          # Utilities & API calls
│   │   └── assets/       # Images & static files
│   └── public/
├── server/               # Express + TypeScript backend
│   ├── src/
│   │   ├── controllers/  # Business logic
│   │   ├── routes/       # API routes
│   │   ├── models/       # MongoDB models
│   │   ├── middleware/    # Auth, validation, etc.
│   │   ├── config/       # Configuration
│   │   └── utils/        # Helper functions
│   └── .env
└── README.md
```

---

## 🔑 Authentication

1. **Sign Up**: Create account at `/signup`
2. **Login**: Use `/login` with email & password
3. **JWT Tokens**: Automatically managed via cookies
4. **Protected Routes**: Dashboard, profile, etc. require authentication

---

## 💰 USDC Tipping Flow

1. Creator sets up profile with Solana wallet
2. Shares unique tip link: `soltip.waliilaw.me/@username`
3. Supporter connects wallet and sends USDC
4. Transaction processed via Circle API
5. Funds deposited to creator's wallet

---

## 🎨 Features

- ✅ User authentication (JWT)
- ✅ Profile customization
- ✅ QR code generation
- ✅ Real-time transaction tracking
- ✅ Wallet integration (Phantom/Solflare)
- ✅ Circle USDC transfers
- ✅ Responsive dark mode UI
- ✅ Orange theme

---

## 🔒 Security Notes

- Use strong JWT secrets (minimum 32 characters)
- Keep Circle API keys secure
- Enable HTTPS in production
- Set up proper CORS origins
- Use MongoDB authentication

---

## 📦 Production Deployment

### Vercel (Frontend)
1. Connect GitHub repo
2. Set build command: `cd client && npm run build`
3. Set output directory: `client/dist`

### Render/Railway (Backend)
1. Connect GitHub repo
2. Set build command: `cd server && npm install`
3. Set start command: `cd server && npm start`
4. Add environment variables from `.env`

---

## 🐛 Troubleshooting

### MongoDB connection fails
- Check `MONGODB_URI` is correct
- Ensure MongoDB is running locally
- For Atlas, check IP whitelist

### JWT errors
- Verify `JWT_SECRET` and `JWT_REFRESH_SECRET` are set
- Ensure secrets are at least 32 characters

### Circle API errors
- Verify API keys are correct
- Check sandbox vs production environment
- Ensure webhook URL is accessible

---

## 📝 API Endpoints

- `POST /api/v1/auth/signup` - Create account
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/users/me` - Get current user
- `POST /api/v1/tips/create` - Create tip transaction
- `GET /api/v1/users/:username` - Get user profile

---

## 🤝 Support

For issues or questions, open an issue on GitHub.

---

**Built with ❤️ on Solana**

