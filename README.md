# 🍔 Food Delivery Web Application

A full-stack food delivery platform built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring real-time order tracking, restaurant management, and a modern user interface.

## ✨ Features

### User Features
- **Authentication & Authorization**
  - User registration and login with JWT
  - Role-based access control (User, Restaurant Owner, Admin)
  - Secure password hashing with bcrypt

- **Restaurant Browsing**
  - Browse restaurants with search functionality
  - Filter by cuisine type
  - Sort by rating or delivery time
  - View restaurant details and menus

- **Shopping & Ordering**
  - Add items to cart with quantity selection
  - Cart management (add, remove, update quantities)
  - Multiple address management
  - Checkout process with address selection
  - Special instructions for orders
  - Multiple payment methods (Cash, Card, Online)

- **Order Management**
  - Real-time order status updates via Socket.io
  - Order tracking with status timeline
  - Order history
  - Reorder functionality
  - Detailed order information

- **User Profile**
  - Profile management
  - Multiple delivery addresses
  - Order history

### Restaurant Features (Admin)
- **Restaurant Profile**
  - Restaurant registration and profile management
  - Business information (cuisine, hours, delivery details)
  - Contact and location information

- **Menu Management**
  - Add, edit, and delete menu items
  - Categorize items (Appetizers, Main Course, Desserts, etc.)
  - Set prices and preparation times
  - Mark items as vegetarian/vegan
  - Toggle item availability

- **Order Management**
  - Real-time order notifications
  - View and manage incoming orders
  - Update order status (Pending → Confirmed → Preparing → Ready → Out for Delivery → Delivered)
  - Filter orders by status
  - View customer details and delivery addresses

- **Analytics Dashboard**
  - Total revenue and order statistics
  - Average order value
  - Revenue trends (last 7 days)
  - Orders by status distribution
  - Popular menu items
  - Visual charts and graphs

### Real-time Features
- Live order status updates using Socket.io
- Real-time notifications for new orders
- Instant status change notifications for customers

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Socket.io** - Real-time communication
- **express-validator** - Input validation

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client
- **Socket.io Client** - Real-time updates
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **Recharts** - Data visualization
- **React Hot Toast** - Notifications

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
cd "Food delivey app"
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env file with your configuration
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/food-delivery
# JWT_SECRET=your_secret_key_here
# NODE_ENV=development
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd ../frontend

# Install dependencies
npm install
```

### 4. Database Setup

Make sure MongoDB is running on your system:

```bash
# Windows (if MongoDB is installed as a service)
net start MongoDB

# Or run mongod manually
mongod
```

## 🎯 Running the Application

### Start Backend Server

```bash
# From backend directory
cd backend
npm run dev
```

The backend server will start on `http://localhost:5000`

### Start Frontend Development Server

```bash
# From frontend directory (in a new terminal)
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

## 📱 Usage Guide

### For Customers

1. **Register/Login**
   - Create an account or login with existing credentials
   - Choose "Customer" as account type

2. **Browse Restaurants**
   - Search for restaurants or cuisines
   - Filter by cuisine type
   - Sort by rating or delivery time

3. **Order Food**
   - Click on a restaurant to view menu
   - Add items to cart
   - Proceed to checkout
   - Add/select delivery address
   - Choose payment method
   - Place order

4. **Track Orders**
   - View order status in real-time
   - Check order history
   - Reorder from past orders

### For Restaurant Owners

1. **Register/Login**
   - Create an account with "Restaurant Owner" role
   - Complete restaurant profile setup

2. **Setup Restaurant**
   - Add restaurant details (name, description, cuisine)
   - Set delivery time, fees, and minimum order
   - Add business hours and contact information

3. **Manage Menu**
   - Add menu items with details
   - Organize items by category
   - Set prices and preparation times
   - Mark items as available/unavailable

4. **Handle Orders**
   - Receive real-time order notifications
   - View order details
   - Update order status through the workflow
   - Track customer information

5. **View Analytics**
   - Monitor revenue and order statistics
   - Analyze popular items
   - Track performance metrics

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Restaurants
- `GET /api/restaurants` - Get all restaurants (with filters)
- `GET /api/restaurants/:id` - Get restaurant by ID
- `POST /api/restaurants` - Create restaurant (auth required)
- `PUT /api/restaurants/:id` - Update restaurant (auth required)
- `GET /api/restaurants/owner/my-restaurant` - Get owner's restaurant

### Menu Items
- `GET /api/menu/restaurant/:restaurantId` - Get restaurant menu
- `POST /api/menu` - Create menu item (restaurant auth)
- `PUT /api/menu/:id` - Update menu item (restaurant auth)
- `DELETE /api/menu/:id` - Delete menu item (restaurant auth)
- `GET /api/menu/my-menu` - Get restaurant's menu items

### Orders
- `POST /api/orders` - Create order (auth required)
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/restaurant/my-orders` - Get restaurant orders
- `PUT /api/orders/:id/status` - Update order status (restaurant auth)
- `GET /api/orders/restaurant/analytics` - Get restaurant analytics

## 🏗️ Project Structure

```
Food delivey app/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Restaurant.js
│   │   ├── MenuItem.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── restaurants.js
│   │   ├── menu.js
│   │   └── orders.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── RestaurantCard.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── RestaurantDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── OrderDetail.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── restaurant/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Orders.jsx
│   │   │       ├── MenuManagement.jsx
│   │   │       └── Profile.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- Role-based access control
- Input validation and sanitization
- CORS configuration

## 🎨 UI/UX Features

- Responsive design for all devices
- Modern and clean interface
- Intuitive navigation
- Real-time notifications
- Loading states and error handling
- Smooth animations and transitions

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Make sure MongoDB is running
mongod

# Check if MongoDB service is active (Windows)
net start MongoDB
```

### Port Already in Use
```bash
# Change PORT in backend/.env
PORT=5001

# Or kill the process using the port
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/food-delivery
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

## 🚀 Deployment

### Backend Deployment (Example: Heroku)
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create new app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

### Frontend Deployment (Example: Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👥 Support

For support, email support@fooddelivery.com or create an issue in the repository.

## 🎯 Future Enhancements

- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Rating and review system
- [ ] Coupon and discount codes
- [ ] Delivery driver tracking
- [ ] Multi-language support
- [ ] Push notifications
- [ ] Advanced analytics
- [ ] Mobile app (React Native)

## 📸 Screenshots

### Customer View
- Home page with restaurant listings
- Restaurant detail with menu
- Shopping cart
- Order tracking

### Restaurant Dashboard
- Analytics dashboard
- Order management
- Menu management
- Restaurant profile

---

**Built with ❤️ using MERN Stack**
