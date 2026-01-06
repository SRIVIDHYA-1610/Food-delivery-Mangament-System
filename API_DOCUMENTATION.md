# 📚 API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Auth Routes

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "user" // or "restaurant"
}
```

**Response:** `201 Created`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### Login
**POST** `/auth/login`

Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### Get Current User
**GET** `/auth/me`

Get currently authenticated user details.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "role": "user",
  "addresses": [
    {
      "label": "Home",
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "isDefault": true
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### Update Profile
**PUT** `/auth/profile`

Update user profile information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+1234567890",
  "addresses": [
    {
      "label": "Home",
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "isDefault": true
    }
  ]
}
```

**Response:** `200 OK`
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Updated",
  "email": "john@example.com",
  "phone": "+1234567890",
  "addresses": [...],
  "role": "user"
}
```

---

## 🍽️ Restaurant Routes

### Get All Restaurants
**GET** `/restaurants`

Get list of all active restaurants with optional filters.

**Query Parameters:**
- `search` (string) - Search by name or cuisine
- `cuisine` (string) - Filter by cuisine type
- `sort` (string) - Sort by 'rating' or 'deliveryTime'

**Example:** `/restaurants?search=pizza&cuisine=Italian&sort=rating`

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Pizza Palace",
    "description": "Best pizza in town",
    "image": "https://example.com/image.jpg",
    "cuisine": ["Italian", "Pizza"],
    "address": {
      "street": "456 Food St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10002"
    },
    "phone": "+1234567890",
    "rating": 4.5,
    "totalRatings": 120,
    "deliveryTime": "30-40 mins",
    "minimumOrder": 15,
    "deliveryFee": 3.99,
    "isActive": true,
    "openingHours": "9:00 AM - 10:00 PM",
    "owner": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Restaurant Owner",
      "email": "owner@example.com"
    }
  }
]
```

---

### Get Restaurant by ID
**GET** `/restaurants/:id`

Get detailed information about a specific restaurant.

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Pizza Palace",
  "description": "Best pizza in town",
  "cuisine": ["Italian", "Pizza"],
  "address": {...},
  "phone": "+1234567890",
  "rating": 4.5,
  "totalRatings": 120,
  "deliveryTime": "30-40 mins",
  "minimumOrder": 15,
  "deliveryFee": 3.99,
  "openingHours": "9:00 AM - 10:00 PM"
}
```

---

### Create Restaurant
**POST** `/restaurants`

Create a new restaurant (Restaurant owner only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Pizza Palace",
  "description": "Best pizza in town",
  "cuisine": ["Italian", "Pizza"],
  "phone": "+1234567890",
  "address": {
    "street": "456 Food St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10002"
  },
  "deliveryTime": "30-40 mins",
  "minimumOrder": 15,
  "deliveryFee": 3.99,
  "openingHours": "9:00 AM - 10:00 PM"
}
```

**Response:** `201 Created`

---

### Update Restaurant
**PUT** `/restaurants/:id`

Update restaurant information (Restaurant owner only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Same as Create Restaurant

**Response:** `200 OK`

---

### Get My Restaurant
**GET** `/restaurants/owner/my-restaurant`

Get restaurant owned by current user (Restaurant owner only).

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

## 🍕 Menu Routes

### Get Restaurant Menu
**GET** `/menu/restaurant/:restaurantId`

Get all menu items for a specific restaurant.

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "restaurant": "507f1f77bcf86cd799439011",
    "name": "Margherita Pizza",
    "description": "Classic pizza with tomato and mozzarella",
    "price": 12.99,
    "category": "Main Course",
    "image": "https://example.com/pizza.jpg",
    "isVegetarian": true,
    "isVegan": false,
    "isAvailable": true,
    "preparationTime": 20,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Get Menu by Category
**GET** `/menu/restaurant/:restaurantId/category/:category`

Get menu items filtered by category.

**Response:** `200 OK`

---

### Create Menu Item
**POST** `/menu`

Add a new menu item (Restaurant owner only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Margherita Pizza",
  "description": "Classic pizza with tomato and mozzarella",
  "price": 12.99,
  "category": "Main Course",
  "isVegetarian": true,
  "isVegan": false,
  "isAvailable": true,
  "preparationTime": 20
}
```

**Response:** `201 Created`

---

### Update Menu Item
**PUT** `/menu/:id`

Update menu item details (Restaurant owner only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Same as Create Menu Item

**Response:** `200 OK`

---

### Delete Menu Item
**DELETE** `/menu/:id`

Delete a menu item (Restaurant owner only).

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "message": "Menu item deleted"
}
```

---

### Get My Menu
**GET** `/menu/my-menu`

Get all menu items for current restaurant owner.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

## 📦 Order Routes

### Create Order
**POST** `/orders`

Place a new order (Authenticated users only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "restaurantId": "507f1f77bcf86cd799439011",
  "items": [
    {
      "menuItem": "507f1f77bcf86cd799439013",
      "quantity": 2
    }
  ],
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "paymentMethod": "cash",
  "specialInstructions": "Extra cheese please"
}
```

**Response:** `201 Created`
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "user": "507f1f77bcf86cd799439011",
  "restaurant": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Pizza Palace",
    "phone": "+1234567890"
  },
  "items": [
    {
      "menuItem": {
        "_id": "507f1f77bcf86cd799439013",
        "name": "Margherita Pizza",
        "image": "..."
      },
      "name": "Margherita Pizza",
      "price": 12.99,
      "quantity": 2
    }
  ],
  "deliveryAddress": {...},
  "status": "pending",
  "subtotal": 25.98,
  "deliveryFee": 3.99,
  "tax": 2.60,
  "total": 32.57,
  "paymentMethod": "cash",
  "specialInstructions": "Extra cheese please",
  "estimatedDeliveryTime": "2024-01-01T01:00:00.000Z",
  "createdAt": "2024-01-01T00:15:00.000Z"
}
```

---

### Get My Orders
**GET** `/orders/my-orders`

Get all orders for current user.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "restaurant": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Pizza Palace",
      "image": "...",
      "phone": "+1234567890"
    },
    "items": [...],
    "status": "delivered",
    "total": 32.57,
    "createdAt": "2024-01-01T00:15:00.000Z"
  }
]
```

---

### Get Order by ID
**GET** `/orders/:id`

Get detailed information about a specific order.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

### Get Restaurant Orders
**GET** `/orders/restaurant/my-orders`

Get all orders for current restaurant (Restaurant owner only).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (string) - Filter by order status

**Example:** `/orders/restaurant/my-orders?status=pending`

**Response:** `200 OK`

---

### Update Order Status
**PUT** `/orders/:id/status`

Update order status (Restaurant owner only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Valid Status Values:**
- `pending`
- `confirmed`
- `preparing`
- `ready`
- `out_for_delivery`
- `delivered`
- `cancelled`

**Response:** `200 OK`

---

### Get Restaurant Analytics
**GET** `/orders/restaurant/analytics`

Get analytics data for restaurant (Restaurant owner only).

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "totalOrders": 150,
  "totalRevenue": 4567.89,
  "averageOrderValue": 30.45,
  "ordersByStatus": {
    "pending": 5,
    "confirmed": 3,
    "preparing": 2,
    "delivered": 140
  },
  "revenueByDay": {
    "2024-01-01": 234.56,
    "2024-01-02": 345.67,
    "2024-01-03": 456.78
  },
  "popularItems": [
    {
      "name": "Margherita Pizza",
      "count": 45
    },
    {
      "name": "Pepperoni Pizza",
      "count": 38
    }
  ]
}
```

---

## 🔌 WebSocket Events

### Client → Server

**Join User Room**
```javascript
socket.emit('join_user_room', userId);
```

**Join Restaurant Room**
```javascript
socket.emit('join_restaurant_room', restaurantId);
```

### Server → Client

**New Order (Restaurant)**
```javascript
socket.on('new_order', (order) => {
  // Handle new order notification
});
```

**Order Status Update (User)**
```javascript
socket.on('order_status_update', (data) => {
  // data: { orderId, status }
});
```

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error message",
  "errors": [
    {
      "msg": "Email is required",
      "param": "email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "No authentication token, access denied"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Restaurant account required."
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error"
}
```

---

## 📝 Notes

1. All timestamps are in ISO 8601 format
2. All prices are in USD
3. Authentication tokens expire after 7 days
4. Real-time updates require Socket.io connection
5. File uploads are not currently supported (planned feature)

---

## 🧪 Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "+1234567890",
    "role": "user"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Restaurants
```bash
curl http://localhost:5000/api/restaurants
```

### Create Order (with token)
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "restaurantId": "RESTAURANT_ID",
    "items": [{"menuItem": "MENU_ITEM_ID", "quantity": 2}],
    "deliveryAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    },
    "paymentMethod": "cash"
  }'
```

---

**API Version:** 1.0.0  
**Last Updated:** 2024
