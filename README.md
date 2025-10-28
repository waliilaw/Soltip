# Soltip - Simple USDC Tipping on Solana 🚀

A decentralized tipping platform built on Solana that enables seamless USDC-based tipping between creators and their supporters through shareable links and QR codes.

## 🚨 The Problem

Most creator tipping tools are either centralized (with high fees and payout limits) or too technical for the average fan. They often require:

- Wallet connection complexity
- App downloads or platform signups
- Complex on-chain actions
- Multiple steps before completing a tip

These roadblocks limit spontaneous tipping and reduce creator earnings.

---

## 💡 Our Solution

**Soltip makes tipping as simple as sharing a link.**

- ✅ **No login required** for tippers
- ✅ **Anonymous tips** with optional notes
- ✅ **Unique profile links** (e.g. `soltip.waliilaw.me/@username`)
- ✅ **QR code support** for easy mobile tipping
- ✅ **USDC on Solana** = fast, stable, low fees
- ✅ **Auto-generated custodial wallets** via **Circle**

It's built to work anywhere — Twitter, Instagram, YouTube, or wherever creators live online.
---

## 🌟 Key Features

- **Instant USDC Tipping**: Send tips using USDC on Solana with near-instant finality
- **Customizable Creator Profiles**: Personalized profiles with custom themes, tip amounts, and social links
- **Circle Integration**: Leveraging Circle's USDC infrastructure for secure transactions
- **QR Code Generation**: Share your profile via QR codes for easy mobile access
- **Beautiful UI/UX**: Modern, responsive design with dark mode support and Solana-themed colors
- **Real-time Transaction Tracking**: Live status updates and transaction confirmations
- **Wallet Integration**: Seamless connection with Solana wallets
- **Anonymous Tipping**: Support creators without revealing your identity

## 🛠 Tech Stack

### Frontend
- React + TypeScript
- Tailwind CSS (with Solana color palette)
- Ant Design Components
- Framer Motion for animations
- Solana Web3.js
- Circle SDK
- QR Code generation

### Backend
- Node.js + Express
- TypeScript
- MongoDB
- Circle API Integration
- JWT Authentication

### Blockchain
- Solana Network (Devnet & Mainnet support)
- USDC Token Integration
- SPL Token Program

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB
- Solana CLI Tools
- Circle Developer Account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/soltip.git
cd soltip
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install all dependencies (client + server)
npm run setup
```

3. Set up environment variables:

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_USDC_MINT=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
```

**Backend (.env):**
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CIRCLE_API_KEY=your_circle_api_key
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_USDC_MINT=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
```

4. Run the development servers:

```bash
# Start both frontend and backend concurrently
npm run dev

# Or start them separately:

# Start frontend (from client directory)
cd client && npm run dev

# Start backend (from server directory)
cd server && npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3000`.

## 🎯 Core Features

### For Creators
- Customizable profile pages with Solana-themed colors
- Multiple tipping options (preset and custom amounts)
- Social media integration
- Transaction history and analytics
- Withdrawal management
- QR code for your profile link

### For Supporters
- Easy-to-use tipping interface
- Multiple payment amounts
- Transaction status tracking
- Personal message with tips
- Instant wallet connection

## 🔒 Security Features

- JWT-based authentication
- Circle's secure wallet infrastructure
- Rate limiting on all API endpoints
- Input sanitization
- Role-based access control
- Secure transaction handling

## 🌐 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh-token` - Refresh access token

### Soltips (Tips)
- `POST /api/v1/tips/submit` - Submit a new tip
- `GET /api/v1/tips/:username` - Get tips for a username

### Transactions
- `POST /api/v1/transactions/withdraw` - Withdraw funds
- `GET /api/v1/transactions/status/:id` - Check transaction status

### Users
- `GET /api/v1/users/profile/:username` - Get public profile
- `PUT /api/v1/users/profile` - Update user profile
- `PUT /api/v1/users/customization` - Update profile customization

## 🎨 UI/UX Features

- Responsive design for mobile and desktop
- Dark/Light mode support
- Animated transitions with Framer Motion
- Loading states and skeletons
- Comprehensive error handling
- Toast notifications for user feedback
- Particle effects on successful tips
- Progress tracking for transactions
- Solana-themed color palette

## 🔄 Transaction Flow

1. User visits creator profile at `soltip.waliilaw.me/@username`
2. Selects tip amount or enters custom amount
3. Connects Solana wallet (if not already connected)
4. Confirms transaction
5. Signs transaction with wallet
6. Transaction processes on Solana
7. Backend validates and records tip
8. Live status updates shown to user
9. Success confirmation with confetti effect

## 🛣️ Roadmap

### Current Features
- ✅ Basic USDC tipping functionality
- ✅ Creator profiles with customization
- ✅ USDC integration on Solana
- ✅ Real-time transaction tracking
- ✅ QR code generation
- ✅ Anonymous tipping

### Future Enhancements
- 🔄 Multi-token support (SOL, other SPL tokens)
- 🔄 Subscription/recurring tips model
- 🔄 Mobile app (iOS & Android)
- 🔄 Advanced analytics dashboard
- 🔄 Creator badges and verification
- 🔄 Batch tipping for multiple creators
- 🔄 DAO integration for governance
- 🔄 NFT rewards for top supporters
- 🔄 Cross-chain support

## 📦 Deployment

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `VITE_API_URL` - Your backend API URL
   - `VITE_USDC_MINT` - USDC mint address
4. Deploy! Vercel will automatically build and deploy

### Backend Deployment (Render/Heroku)

#### Render
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd server && npm install && npm run build`
4. Set start command: `cd server && npm start`
5. Add environment variables from your `.env` file
6. Deploy!

#### Heroku
```bash
# Login to Heroku
heroku login

# Create new app
heroku create your-soltip-api

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
# ... set other env vars

# Deploy
git push heroku main
```

### Testing on Solana Devnet

1. Use devnet USDC mint: `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`
2. Set `SOLANA_RPC_URL=https://api.devnet.solana.com`
3. Fund your wallet with devnet SOL from [Solana Faucet](https://faucet.solana.com/)
4. The app will offer to airdrop devnet USDC if balance is insufficient

## 🧪 Testing

```bash
# Run frontend tests
cd client
npm test

# Run backend tests
cd server
npm test
```

---

**Built with ❤️ on Solana**
