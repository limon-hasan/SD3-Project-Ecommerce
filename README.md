# ShopSphere - Full Stack E-commerce Application 🛍️

ShopSphere is a robust, dynamic, and modern full-stack MERN (MongoDB, Express, React, Node.js) e-commerce platform built for a premium shopping experience. 

## Features

### Frontend (User Experience)
*   **Modern Design**: Glassmorphism UI with responsive layouts and Dark/Light theme switching.
*   **Product Catalog**: Dynamic product listings, category filtering, and advanced search functionality.
*   **Smart Chatbot ("Sphere")**: Context-aware AI assistant that can answer product questions, check reviews, and track real-time order status.
*   **Authentication & Validation**: Secure Login and Registration with strict client-side validation (email format, password strength) and professional toast notifications.
*   **Members-Only Access**: Product catalog and chatbot are restricted to logged-in users.
*   **Wishlist & Profiles**: Users can save favorite items and view detailed order history.
*   **Reviews & Ratings**: Logged-in customers can leave 5-star ratings and text reviews on purchased products.
*   **Dual Payment Gateways**: 
    *   **Stripe**: Integrated for seamless Credit/Debit Card processing.
    *   **bKash**: Custom manual integration flow with Transaction ID verification.

### Backend & Admin
*   **Dedicated Admin Portal**: Separate interface for store administrators.
*   **Product Management**: Full CRUD operations for the product catalog.
*   **Order Management**: View all orders and update delivery status.
*   **Analytics Dashboard**: Visual charts tracking sales, revenue, and order trends.
*   **Email Notifications**: Automated HTML welcome/verification emails sent via Nodemailer to new users.

## Tech Stack
*   **Frontend**: React (Vite), React Router, Context API, CSS Variables (Custom Design System), `react-hot-toast`, Stripe Elements.
*   **Backend**: Node.js, Express.js, MongoDB (Mongoose), JSON Web Tokens (JWT), Bcrypt.js, Nodemailer.
*   **Tools**: Git, Postman (API Testing).

## Getting Started

### Prerequisites
*   Node.js (v18+)
*   MongoDB Instance (Local or Atlas)
*   Stripe Account (for payment keys)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/limon-hasan/SD3-Project-Ecommerce.git
    cd SD3-Project-Ecommerce
    ```

2.  **Install dependencies for Backend:**
    ```bash
    cd Backend
    npm install
    ```

3.  **Install dependencies for Frontend:**
    ```bash
    cd Frontend
    npm install
    ```

4.  **Environment Variables:**
    *   Create a `.env` file in the `Backend` directory containing:
        ```env
        PORT=5000
        MONGODB_URI=your_mongo_db_connection_string
        JWT_SECRET=your_jwt_secret
        EMAIL_USER=your_gmail_address
        EMAIL_PASS=your_gmail_app_password
        STRIPE_SECRET_KEY=your_stripe_secret_key
        ```
    *   In the `Frontend` directory, ensure Stripe keys are configured in your `.env` or components.

5.  **Seed the Database (Optional):**
    ```bash
    cd Backend
    node src/seeder.js -i
    ```

6.  **Run the Application:**
    *   Open two terminals.
    *   Terminal 1 (Backend): `cd Backend && npm run dev`
    *   Terminal 2 (Frontend): `cd Frontend && npm run dev`

7.  **Access:**
    *   Frontend: `http://localhost:5173`
    *   Backend API: `http://localhost:5000`

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
