const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const { auth, isRestaurant } = require('../middleware/auth');

// Get menu items for a restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ 
      restaurant: req.params.restaurantId 
    }).sort({ category: 1, name: 1 });
    
    res.json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get menu items by category
router.get('/restaurant/:restaurantId/category/:category', async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ 
      restaurant: req.params.restaurantId,
      category: req.params.category
    });
    
    res.json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create menu item (restaurant owner only)
router.post('/', auth, isRestaurant, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.userId });
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const menuItem = new MenuItem({
      ...req.body,
      restaurant: restaurant._id
    });

    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update menu item
router.put('/:id', auth, isRestaurant, async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id).populate('restaurant');
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    if (menuItem.restaurant.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(menuItem, req.body);
    await menuItem.save();

    res.json(menuItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete menu item
router.delete('/:id', auth, isRestaurant, async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id).populate('restaurant');
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    if (menuItem.restaurant.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get my restaurant's menu items
router.get('/my-menu', auth, isRestaurant, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.userId });
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const menuItems = await MenuItem.find({ restaurant: restaurant._id })
      .sort({ category: 1, name: 1 });
    
    res.json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
