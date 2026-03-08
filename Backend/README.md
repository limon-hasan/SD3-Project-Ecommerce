# Backend API Documentation

## Overview
Express.js RESTful API for e-commerce platform with MongoDB database, JWT authentication, and comprehensive error handling.

## Quick Start

```bash
cd Backend
npm install
npm run dev
```

Server runs on `http://localhost:3000`

## Environment Variables (.env)

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce

# Authentication
JWT_SECRET=your_very_secret_jwt_key_change_this

# CORS
FRONTEND_URL=http://localhost:5173

# Email (Optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## Project Structure

```
Backend/
├── src/
│   ├── server.js                    # Express app setup
│   ├── models/                      # MongoDB schemas
│   │   ├── userModel.js
│   │   ├── productModel.js
│   │   ├── orderModel.js
│   │   └── logModel.js (optional)
│   ├── controllers/                 # Business logic
│   │   ├── userController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── paymentController.js
│   ├── routes/                      # API routes
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── analyticsRoutes.js
│   ├── middleware/                  # Custom middleware
│   │   ├── authMiddleware.js        # JWT verification
│   │   ├── validationMiddleware.js  # Input validation
│   │   └── errorMiddleware.js       # Error handling
│   └── utils/
│       ├── emailService.js          # Send emails
│       └── logger.js                # Logging
├── package.json
├── .env
└── README.md
```

## API Endpoints

### Authentication & Users

#### Register
```
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: 201 Created
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "isAdmin": false,
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Login
```
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: 200 OK
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "isAdmin": false,
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Get Profile
```
GET /api/users/profile
Authorization: Bearer <token>

Response: 200 OK
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "isAdmin": false
}
```

#### Wishlist
```
GET /api/users/wishlist
Authorization: Bearer <token>

POST /api/users/wishlist/:productId
Authorization: Bearer <token>
```

---

### Products

#### Get All Products
```
GET /api/products

Response: 200 OK
[
  {
    "_id": "...",
    "name": "Product Name",
    "price": 99.99,
    "category": "Electronics",
    "description": "...",
    "countInStock": 10,
    "rating": 4.5,
    "numReviews": 12,
    "imageUrl": "https://...",
    "reviews": [...]
  },
  ...
]
```

#### Get Product by ID
```
GET /api/products/:id

Response: 200 OK
{
  "_id": "...",
  "name": "Product Name",
  "price": 99.99,
  "description": "...",
  "category": "Electronics",
  "countInStock": 10,
  "rating": 4.5,
  "numReviews": 12,
  "imageUrl": "https://...",
  "reviews": [
    {
      "_id": "...",
      "name": "John Doe",
      "rating": 5,
      "comment": "Great product!",
      "createdAt": "2024-01-15T..."
    }
  ]
}
```

#### Create Product (Admin)
```
POST /api/products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "stock": 20,
  "category": "Electronics",
  "imageUrl": "https://example.com/image.jpg"
}

Response: 201 Created
```

#### Update Product (Admin)
```
PUT /api/products/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 89.99,
  "stock": 15
}

Response: 200 OK
```

#### Delete Product (Admin)
```
DELETE /api/products/:id
Authorization: Bearer <admin_token>

Response: 200 OK
```

#### Add Product Review
```
POST /api/products/:id/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent product!"
}

Response: 201 Created
```

---

### Orders

#### Create Order
```
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderItems": [
    {
      "name": "Product Name",
      "quantity": 2,
      "price": 99.99,
      "product": "productId123"
    }
  ],
  "shippingAddress": {
    "address": "123 Main St",
    "city": "New York",
    "postalCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "credit_card",
  "totalPrice": 199.98
}

Response: 201 Created
{
  "_id": "...",
  "user": "...",
  "orderItems": [...],
  "totalPrice": 199.98,
  "isPaid": false,
  "isDelivered": false,
  "createdAt": "2024-01-15T..."
}
```

#### Get Order by ID
```
GET /api/orders/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "_id": "...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "orderItems": [...],
  "shippingAddress": {...},
  "totalPrice": 199.98,
  "isPaid": false,
  "paidAt": null,
  "isDelivered": false,
  "createdAt": "2024-01-15T..."
}
```

#### Get My Orders
```
GET /api/orders/myorders
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "_id": "...",
    "totalPrice": 199.98,
    "isPaid": false,
    "createdAt": "2024-01-15T..."
  },
  ...
]
```

#### Get All Orders (Admin)
```
GET /api/orders
Authorization: Bearer <admin_token>

Response: 200 OK
[
  {
    "_id": "...",
    "user": {
      "_id": "...",
      "name": "John Doe"
    },
    "totalPrice": 199.98,
    "isPaid": true,
    "isDelivered": false,
    "createdAt": "2024-01-15T..."
  },
  ...
]
```

#### Mark Order as Paid
```
PUT /api/orders/:id/pay
Authorization: Bearer <token>
Content-Type: application/json

{
  "id": "stripe_payment_id",
  "status": "completed",
  "update_time": "2024-01-15T...",
  "email_address": "customer@example.com"
}

Response: 200 OK
```

#### Mark Order as Delivered (Admin)
```
PUT /api/orders/:id/deliver
Authorization: Bearer <admin_token>

Response: 200 OK
```

---

## Middleware

### Authentication Middleware
```javascript
// Protects routes that require authentication
const { protect, admin } = require('./middleware/authMiddleware');

// Usage:
router.get('/profile', protect, getUserProfile); // Any authenticated user
router.post('/', protect, admin, createProduct); // Only admin
```

### Validation Middleware
```javascript
const { validateRegistration, validate } = require('./middleware/validationMiddleware');

// Usage:
router.post('/', validateRegistration, validate, registerUser);
```

### Error Handling
- Automatic error catching for async/await functions
- Consistent error response format
- Detailed error messages in development mode
- Generic messages in production mode

---

## Error Responses

### 400 Bad Request
```json
{
  "status": "fail",
  "message": "Invalid input or missing required field"
}
```

### 401 Unauthorized
```json
{
  "status": "fail",
  "message": "Not authorized, no token"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "status": "error",
  "message": "Something went wrong!"
}
```

---

## Security Features

✅ **Password Hashing**
- bcryptjs with salt rounds = 10

✅ **JWT Tokens**
- Issued on login/register
- 30-day expiration
- Verified on protected routes

✅ **Rate Limiting**
- 100 requests per 15 minutes per IP
- Applied to all `/api/*` routes

✅ **Input Validation**
- Express-validator on all POST/PUT endpoints
- Email, password, and data type validation

✅ **Security Headers**
- Helmet.js enabled
- XSS protection
- CSRF protection
- Frame injection prevention

✅ **CORS**
- Restricted to frontend origin only
- Credentials allowed
- Specific HTTP methods allowed

---

## Dependencies

```json
{
  "express": "^4.18.2",
  "mongoose": "^7.5.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.1",
  "dotenv": "^16.3.1",
  "cors": "^2.8.5",
  "helmet": "^7.0.0",
  "express-validator": "^7.0.1",
  "express-rate-limit": "^7.1.1",
  "express-async-handler": "^1.2.0",
  "nodemailer": "^7.0.11",
  "stripe": "^20.0.0"
}
```

---

## Development

### Run in Development Mode
```bash
npm run dev
```
Uses nodemon for automatic restart on file changes.

### Run in Production Mode
```bash
npm start
```

### Available Scripts
- `npm run dev` — Development with hot reload
- `npm start` — Production mode

---

## MongoDB Setup

### Local MongoDB
```bash
# Windows
mongod

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### MongoDB Atlas (Cloud)
1. Create account at mongodb.com
2. Create a cluster
3. Get connection string
4. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
   ```

---

## Troubleshooting

### Port Already in Use
```bash
# Find process on port 3000
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F
```

### MongoDB Connection Error
- Check MongoDB is running
- Verify connection string in `.env`
- Check network access (if using Atlas)

### JWT Errors
- Ensure `JWT_SECRET` is set in `.env`
- Check token format: `Bearer <token>`
- Verify token hasn't expired

### Email Not Sending
- Enable 2FA and generate App Password (Gmail)
- Update EMAIL_USER and EMAIL_PASS in `.env`
- Check nodemailer configuration

---

## Next Steps & Enhancements

- [ ] Implement Stripe payment integration
- [ ] Add email notifications for orders
- [ ] Implement product image upload
- [ ] Add advanced analytics dashboard
- [ ] Implement seller roles
- [ ] Add SMS notifications
- [ ] Deploy to production
- [ ] Implement caching (Redis)
- [ ] Add API rate limiting per user
- [ ] Implement refresh tokens

---

**For questions, check terminal logs and use `console.log()` for debugging.**
