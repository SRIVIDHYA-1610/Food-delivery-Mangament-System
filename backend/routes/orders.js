const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const { auth, isRestaurant } = require('../middleware/auth');

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const { restaurantId, items, deliveryAddress, paymentMethod, specialInstructions } = req.body;

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        return res.status(404).json({ message: `Menu item ${item.menuItem} not found` });
      }

      subtotal += menuItem.price * item.quantity;
      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity
      });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    const deliveryFee = restaurant.deliveryFee || 0;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + deliveryFee + tax;

    // Set estimated delivery time (current time + 45 minutes)
    const estimatedDeliveryTime = new Date(Date.now() + 45 * 60000);

    const order = new Order({
      user: req.userId,
      restaurant: restaurantId,
      items: orderItems,
      deliveryAddress,
      subtotal,
      deliveryFee,
      tax,
      total,
      paymentMethod,
      specialInstructions,
      estimatedDeliveryTime
    });

    await order.save();
    
    // Populate order details
    await order.populate('restaurant', 'name phone');
    await order.populate('items.menuItem', 'name image');

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.to(`restaurant_${restaurantId}`).emit('new_order', order);

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate('restaurant', 'name image phone')
      .populate('items.menuItem', 'name image')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurant', 'name image phone address')
      .populate('items.menuItem', 'name image')
      .populate('user', 'name phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is the restaurant owner
    const restaurant = await Restaurant.findById(order.restaurant._id);
    if (order.user._id.toString() !== req.userId && 
        restaurant.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get restaurant's orders (restaurant owner only)
router.get('/restaurant/my-orders', auth, isRestaurant, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.userId });
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const { status } = req.query;
    let query = { restaurant: restaurant._id };
    
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name phone')
      .populate('items.menuItem', 'name image')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (restaurant owner only)
router.put('/:id/status', auth, isRestaurant, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id).populate('restaurant');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.restaurant.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.status = status;
    await order.save();

    await order.populate('user', 'name phone');
    await order.populate('items.menuItem', 'name image');

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.to(`user_${order.user._id}`).emit('order_status_update', {
      orderId: order._id,
      status: order.status
    });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get restaurant analytics (restaurant owner only)
router.get('/restaurant/analytics', auth, isRestaurant, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.userId });
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Get orders from last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const orders = await Order.find({
      restaurant: restaurant._id,
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Calculate analytics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Orders by status
    const ordersByStatus = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    // Revenue by day (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentOrders = orders.filter(order => order.createdAt >= sevenDaysAgo);
    
    const revenueByDay = {};
    recentOrders.forEach(order => {
      const day = order.createdAt.toISOString().split('T')[0];
      revenueByDay[day] = (revenueByDay[day] || 0) + order.total;
    });

    // Popular items
    const itemCounts = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const itemName = item.name;
        itemCounts[itemName] = (itemCounts[itemName] || 0) + item.quantity;
      });
    });

    const popularItems = Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    res.json({
      totalOrders,
      totalRevenue,
      averageOrderValue,
      ordersByStatus,
      revenueByDay,
      popularItems
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
