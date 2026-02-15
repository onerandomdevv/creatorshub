# CreatorsHub Backend API

The backend API for the CreatorsHub platform, built with Node.js, Express, and MongoDB. It provides authentication, product management, order processing, and analytics features.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT & bcryptjs
- **File Storage**: Cloudinary (via Multer)
- **Email**: Nodemailer

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas URI)
- Cloudinary Account (for image uploads)

### Installation

1.  Navigate to the backend directory:

    ```bash
    cd backend
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Set up environment variables:
    Create a `.env` file in the `backend` directory with the following:

    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    NODE_ENV=development

    # Cloudinary Config
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret

    # Email Config (if applicable)
    EMAIL_SERVICE=gmail
    EMAIL_USER=your_email@gmail.com
    EMAIL_PASS=your_email_app_password
    ```

4.  Start the development server:
    ```bash
    npm run dev
    ```

## 📜 Scripts

- `npm run start`: Starts the server in production mode.
- `npm run dev`: Starts the server with Nodemon for development.
- `npm run reset-db`: Resets the database (use with caution).
- `npm run data:import`: Import sample data (if configured).

## 🔌 API Endpoints

### Auth

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user & get token

### Products

- `GET /api/products` - Get all products
- `POST /api/products` - Create a product
- `GET /api/products/:id` - Get single product

### Orders

- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order

### Analytics

- `GET /api/analytics` - Get dashboard analytics data

### Settings

- `GET /api/settings` - Get application settings
- `PUT /api/settings` - Update settings
