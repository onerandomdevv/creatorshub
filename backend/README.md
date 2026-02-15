# ⚡ Creators Hub Foundry - Backend

**Creators Hub Foundry API** is the powerhouse behind the premium e-commerce experience. Built with Node.js, Express, and MongoDB, it handles secure authentication, product management, orders, analytics, and real-time store settings.

## 🚀 Features

- **🛡️ Secure Authentication**:
  - JWT-based auth with encrypted passwords (`bcryptjs`).
  - **Email Verification**: 6-digit OTP verification flow.
  - **Password Reset**: Secure token-based password recovery via email.
- **📊 Analytics Engine**: Real-time sales tracking, revenue visualization, and product performance metrics.
- **📦 Unified Product Engine**: Advanced filtering, niche categorization, and image metadata management.
- **🛒 Order Orchestration**: Complete checkout lifecycle management with email notifications.
- **⚙️ Dynamic Store Settings**: Singleton configuration system for global currency, address, and social media links.
- **🖼️ Cloudinary Storage Integration**: Scalable cloud-based media management for product images (production ready).
- **🔒 Robust Middleware**: Custom protection and admin-only authorization layers.
- **🧹 Database Maintenance**: Dedicated scripts for safe data cleanup and environment resets.

## 🛠️ Tech Stack

- **Platform**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (via Mongoose)
- **Security**: [JSON Web Token (JWT)](https://jwt.io/), [Bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Email**: [Nodemailer](https://nodemailer.com/)

## 🏁 Getting Started

### Prerequisites

- Node.js 18.x or later
- MongoDB (Local instance or Atlas URI)
- npm, yarn, pnpm, or bun

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

# Frontend Configuration
FRONTEND_URL=https://your-frontend.onrender.com

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Gmail App Password recommended)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@creatorshub.com

```

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/AliameenXBT/creatorshub-ecommerce-bd.git
   cd creatorshub-ecommerce-bd
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Seed Database (Optional):**

   ```bash
   node seeder.js
   ```

4. **Maintenance Scripts:**

   ```bash
   # Reset Database (Clear products and orders)
   npm run reset-db
   ```

5. **Run the server:**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 🏗️ API Structure

- `/api/auth`: Login, Register, Verify Email, Password Reset.
- `/api/products`: Catalog management and filtering.
- `/api/orders`: Order processing and history.
- `/api/analytics`: Admin dashboard data (Protected).
- `/api/settings`: Global store configuration.
- `/api/upload`: Image hosting and management.

## 📄 License

This project is licensed under the **MIT License**.

---

Engineered for the visionaries of tomorrow. ⚡
