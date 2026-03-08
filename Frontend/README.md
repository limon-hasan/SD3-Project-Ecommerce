# Frontend Documentation

## Overview
React + Vite frontend for e-commerce platform with modern UI, state management using Context API, and integrated API client.

## Quick Start

```bash
cd Frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## Project Structure

```
Frontend/
├── src/
│   ├── main.jsx                     # Entry point
│   ├── App.jsx                      # Root component
│   ├── App.css                      # Global styles
│   ├── index.css                    # Base styles
│   ├── pages/                       # Page components
│   │   ├── HomePage.jsx
│   │   ├── ProductPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── NotFoundPage.jsx
│   │   └── Admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── ProductList.jsx
│   │       ├── OrderList.jsx
│   │       └── AnalyticsDashboard.jsx
│   ├── components/                  # Reusable components
│   │   ├── Layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Navbar.css
│   │   │   ├── Footer.jsx
│   │   │   └── Footer.css
│   │   ├── Chatbot/
│   │   │   ├── Chatbot.jsx
│   │   │   └── Chatbot.css
│   │   └── UI/
│   │       ├── Button.jsx
│   │       ├── Button.css
│   │       ├── ProductCard.jsx
│   │       └── ProductCard.css
│   ├── context/                     # Global state
│   │   ├── ShopContext.jsx          # Products, cart, user, auth
│   │   └── ThemeContext.jsx         # Dark/light mode
│   └── assets/                      # Images, icons, fonts
│
├── vite.config.js                   # Vite configuration with API proxy
├── package.json
├── index.html
└── README.md
```

## Features

### Pages

#### HomePage
- Hero section with call-to-action
- Featured products grid
- Search & category filtering
- Product cards with images and prices

#### ProductPage
- Detailed product view
- Product image gallery
- Price, stock status, description
- Add to cart button
- Customer reviews section
- Review submission form (authenticated users)

#### CartPage
- View all cart items
- Adjust quantities
- Remove items
- Subtotal & total calculation
- Proceed to checkout button

#### CheckoutPage
- Shipping address form
- Payment method selection
- Order review
- Place order button
- Order confirmation

#### LoginPage
- Email & password form
- Remember me checkbox
- Links to register & forgot password

#### RegisterPage
- Name, email, password fields
- Password confirmation
- Terms acceptance
- Links to login

#### ProfilePage
- User information display
- Edit profile option
- Order history
- Wishlist items

#### Admin Pages
- **AdminDashboard**: Overview of sales, orders, products
- **ProductList**: Create, edit, delete products
- **OrderList**: View, update order status
- **AnalyticsDashboard**: Sales charts, user metrics

### Components

#### Navbar
- Logo and branding
- Navigation links (Home, Products, Cart, Login)
- User menu dropdown
- Admin dashboard link (for admins)
- Mobile responsive hamburger menu

#### Footer
- Company info & links
- Product categories
- Customer support links
- Social media
- Newsletter subscription

#### ProductCard
- Product image
- Name & price
- Rating display
- Quick add to cart button
- Link to product details

#### Button
- Primary, secondary, outline variants
- Disabled state
- Loading state
- Accessible with proper ARIA labels

#### Chatbot
- AI assistant for customer support
- Chat interface
- Common questions
- Live chat integration ready

### Context (State Management)

#### ShopContext
Global state for:
- **Products**: List of all products, fetch function
- **Cart**: Items in cart, add/remove/update functions
- **User**: Current user info, login/logout functions
- **Auth**: JWT token management
- **Wishlist**: User's wishlist items

Methods:
```javascript
// Products
fetchProducts()           // Fetch all products from API
createProduct()           // Admin: create product
deleteProduct()           // Admin: delete product

// Cart
addToCart(product, qty)   // Add item to cart
removeFromCart(id)        // Remove item from cart

// Auth
login(email, password)    // Login user
register(name, email, password)  // Register user
logout()                  // Logout and clear data

// Orders
createOrder(orderData)    // Create new order
getMyOrders()            // Fetch user's orders
fetchAllOrders()         // Admin: fetch all orders
deliverOrder()           // Admin: mark order delivered

// Reviews
createProductReview()    // Submit product review

// Wishlist
toggleWishlist(id)       // Add/remove from wishlist
getWishlist()           // Fetch user's wishlist
```

#### ThemeContext
- Dark/light mode toggle
- Theme preference persistence
- CSS variable support

## API Integration

### Base URL
- Development: `http://localhost:3000/api`
- Production: `https://your-api-domain.com/api`
- Proxy via Vite: `/api` (configured in vite.config.js)

### Authentication
Tokens stored in `localStorage` as `userInfo`:
```javascript
// After login/register
localStorage.setItem('userInfo', JSON.stringify(userData));
// userData includes: _id, name, email, isAdmin, token

// Accessing token in requests
const userInfo = JSON.parse(localStorage.getItem('userInfo'));
const token = userInfo.token;

// Header format
'Authorization': `Bearer ${token}`
```

### Common API Calls

```javascript
// Register
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, password })
})

// Login
fetch('/api/users/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})

// Get Products
fetch('/api/products')

// Get Product Details
fetch(`/api/products/${productId}`)

// Create Order (protected)
fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(orderData)
})

// Add Review (protected)
fetch(`/api/products/${productId}/reviews`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ rating, comment })
})
```

## Styling

### CSS Architecture
- **Global Styles**: `index.css`, `App.css`
- **Page Styles**: Each page has `.css` file
- **Component Styles**: Co-located with components

### Design System
- **Colors**: Primary, secondary, success, danger, warning
- **Typography**: Clean, readable fonts
- **Spacing**: Consistent padding/margin scale
- **Responsive**: Mobile-first approach
- **Glassmorphism**: Modern glass effect on cards

### CSS Variables (in index.css)
```css
:root {
  --primary-color: #6366f1;
  --secondary-color: #ec4899;
  --bg-color: #ffffff;
  --text-color: #1f2937;
  --border-color: #e5e7eb;
}
```

## Routing

```
/                      → HomePage
/product/:id           → ProductPage
/cart                  → CartPage
/checkout              → CheckoutPage
/login                 → LoginPage
/register              → RegisterPage
/profile               → ProfilePage
/admin                 → AdminDashboard
/admin/products        → ProductList
/admin/orders          → OrderList
/admin/analytics       → AnalyticsDashboard
/*                     → NotFoundPage
```

## Development

### Available Scripts

```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Hot Module Replacement (HMR)
- Automatic page refresh on code changes
- Fast development feedback
- State preservation in some cases

### Browser DevTools
- React DevTools extension (recommended)
- Network tab to inspect API calls
- Console for error messages
- Local storage inspection

## Dependencies

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.9.6",
  "react-hot-toast": "^2.6.0",
  "@stripe/react-stripe-js": "^5.4.1",
  "@stripe/stripe-js": "^8.5.3"
}
```

## Performance Tips

1. **Code Splitting**
   - Use React.lazy() for route-based splitting
   - Lazy load admin pages

2. **Image Optimization**
   - Compress product images
   - Use WebP format with fallbacks
   - Implement lazy loading

3. **Caching**
   - Leverage browser cache headers
   - Cache product lists with stale-while-revalidate

4. **Bundle Size**
   - Monitor with `npm run build`
   - Remove unused dependencies

## Common Issues & Solutions

### CORS Errors
**Problem**: "Access to XMLHttpRequest blocked by CORS"

**Solution**:
- Ensure backend CORS is configured for `http://localhost:5173`
- Check backend `.env` has correct `FRONTEND_URL`
- Restart backend after changes

### API Not Responding
**Problem**: Network calls fail or hang

**Solution**:
- Verify backend is running on port 3000
- Check browser Network tab for request status
- Verify vite proxy config: `/api` → `http://localhost:3000`
- Check API response in Network tab

### Login/Auth Not Working
**Problem**: Login succeeds but redirects fail or token not saved

**Solution**:
- Check localStorage for `userInfo` key (F12 → Application)
- Verify token format in Network tab response
- Clear localStorage and try again
- Check console for JavaScript errors

### Styling Issues
**Problem**: Styles not applying or component looks broken

**Solution**:
- Clear browser cache (Ctrl+Shift+Delete)
- Check CSS file imports are correct
- Verify CSS variable definitions
- Use browser DevTools to inspect computed styles

### Performance Issues
**Problem**: Page loads slowly or feels sluggish

**Solution**:
- Check Network tab for large assets
- Monitor JavaScript execution (DevTools → Performance)
- Reduce number of products fetched
- Implement pagination for product lists

## Testing

### Manual Testing Checklist
- [ ] Register a new user
- [ ] Login with registered account
- [ ] Browse products & search
- [ ] Add products to cart
- [ ] Update cart quantities
- [ ] Remove items from cart
- [ ] Proceed to checkout
- [ ] Submit order
- [ ] View order history
- [ ] Submit product review
- [ ] Toggle wishlist items
- [ ] Admin: Create product
- [ ] Admin: Edit product
- [ ] Admin: Delete product
- [ ] Admin: View all orders
- [ ] Mobile responsiveness

## Deployment

### Build for Production
```bash
npm run build
```
Creates optimized build in `dist/` folder.

### Deployment Platforms
- **Vercel** (recommended for Next.js/React apps)
- **Netlify** (GitHub integration)
- **AWS S3 + CloudFront**
- **GitHub Pages**

### Environment Variables
Create `.env.production` for production API URL:
```
VITE_API_URL=https://your-api-domain.com
```

Update API calls to use this variable:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

## Next Steps & Enhancements

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Product image upload
- [ ] Advanced search & filters
- [ ] Wishlist sharing
- [ ] Product recommendations
- [ ] User reviews pagination
- [ ] Real-time order tracking
- [ ] Push notifications
- [ ] Multi-language support
- [ ] Accessibility improvements (WCAG)

---

**Happy coding! For help, check browser console and DevTools Network tab.**
