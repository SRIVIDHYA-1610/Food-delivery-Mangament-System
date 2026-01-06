# 🚀 Quick Setup Guide

## Step-by-Step Installation

### 1. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/food-delivery
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**Important:** Change `JWT_SECRET` to a random secure string in production!

### 3. Start MongoDB

Make sure MongoDB is installed and running:

**Windows:**
```bash
# If installed as service
net start MongoDB

# Or run manually
mongod
```

**Mac/Linux:**
```bash
# Using Homebrew (Mac)
brew services start mongodb-community

# Or run manually
mongod
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🎯 Test Accounts

### Create Test Users

1. **Customer Account:**
   - Go to http://localhost:3000/register
   - Fill in details
   - Select "Customer" as account type

2. **Restaurant Owner Account:**
   - Go to http://localhost:3000/register
   - Fill in details
   - Select "Restaurant Owner" as account type
   - Complete restaurant profile after registration

## 📝 Quick Testing Workflow

### As a Restaurant Owner:
1. Register as restaurant owner
2. Complete restaurant profile (name, cuisine, delivery details)
3. Add menu items (at least 3-5 items)
4. Go to Orders page to wait for orders

### As a Customer:
1. Register as customer
2. Browse restaurants
3. Click on a restaurant
4. Add items to cart
5. Proceed to checkout
6. Add delivery address
7. Place order
8. Track order status in real-time

### Test Real-time Features:
1. Place an order as customer
2. Switch to restaurant dashboard
3. Update order status
4. See real-time updates on customer's order detail page

## 🔧 Common Issues

### Issue: MongoDB Connection Error
**Solution:** Make sure MongoDB is running
```bash
# Check if MongoDB is running
# Windows
tasklist | findstr mongod

# Mac/Linux
ps aux | grep mongod
```

### Issue: Port 5000 already in use
**Solution:** Change port in backend/.env
```env
PORT=5001
```

### Issue: Cannot connect to backend
**Solution:** Check if backend is running and CORS is configured correctly

### Issue: Real-time updates not working
**Solution:** Make sure Socket.io connection is established. Check browser console for errors.

## 📦 Production Deployment Checklist

- [ ] Change JWT_SECRET to a secure random string
- [ ] Set NODE_ENV=production
- [ ] Use production MongoDB database (MongoDB Atlas)
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS
- [ ] Set up proper error logging
- [ ] Configure rate limiting
- [ ] Set up backup strategy
- [ ] Configure CDN for static assets
- [ ] Set up monitoring and alerts

## 🎨 Customization

### Change Primary Color
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: {
    // Change these values
    500: '#ef4444',
    600: '#dc2626',
    // ...
  }
}
```

### Add New Menu Categories
Edit `backend/models/MenuItem.js`:
```javascript
category: {
  type: String,
  required: true,
  enum: ['Appetizers', 'Main Course', 'YourNewCategory', ...]
}
```

## 💡 Tips

1. **Use MongoDB Compass** for easier database management
2. **Install React DevTools** for debugging React components
3. **Use Postman** to test API endpoints
4. **Check browser console** for frontend errors
5. **Check terminal logs** for backend errors

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Documentation](https://react.dev/)
- [Socket.io Documentation](https://socket.io/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

---

Need help? Check the main README.md for more detailed information!
