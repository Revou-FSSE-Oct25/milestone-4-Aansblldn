# RevoBank API

Secure banking API built with NestJS, Prisma, and PostgreSQL/SQLite.

## 🌐 Live Demo
You can access the live API and documentation here:
- **Production URL:** [https://revobank-api-aan-production.up.railway.app/](https://revobank-api-aan-production.up.railway.app/)
- **Swagger Documentation:** [https://revobank-api-aan-production.up.railway.app/api-docs](https://revobank-api-aan-production.up.railway.app/api-docs)

---

## Features

### Authentication
- User registration with JWT token
- User login with JWT token
- Protected routes with JWT Guard

### Account Management
- Create bank accounts (Savings/Checking)
- List all user accounts
- Get specific account details
- Update account information
- Delete accounts

### Transactions
- Deposit to account
- Withdraw from account (with balance validation)
- Transfer between accounts (with balance validation)
- Transaction history

### Security
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (Customer/Admin)
- Users can only access their own data

## Technologies

- **Framework:** NestJS
- **ORM:** Prisma
- **Database:** SQLite (development) / PostgreSQL (production)
- **Authentication:** JWT, Passport
- **Validation:** class-validator, class-transformer
- **Documentation:** Swagger/OpenAPI
- **Testing:** Jest

## Installation

```bash
# Clone repository
git clone [https://github.com/Revou-FSSE-Oct25/milestone-4-Aansblldn](https://github.com/Revou-FSSE-Oct25/milestone-4-Aansblldn)
cd revobank-api

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Database setup
npx prisma migrate dev
npx prisma generate

# Run tests
npm test

# Start development server
npm run start:dev