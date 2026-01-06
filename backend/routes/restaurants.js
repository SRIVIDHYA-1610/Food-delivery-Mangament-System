const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const { auth, isRestaurant } = require('../middleware/auth');

// Get all restaurants with search and filter
router.get('/', async (req, res) => {
  try {
    const { search, cuisine, sort } = req.query;
    let query = { isActive: true };

    // Search by name or cuisine
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cuisine: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by cuisine
    if (cuisine) {
      query.cuisine = { $in: [cuisine] };
    }

    let restaurants = await Restaurant.find(query).populate('owner', 'name email');

    // Sort
    if (sort === 'rating') {
      restaurants = restaurants.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'deliveryTime') {
      restaurants = restaurants.sort((a, b) => a.deliveryTime.localeCompare(b.deliveryTime));
    }

    res.json(restaurants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate('owner', 'name email');
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create restaurant (restaurant owner only)
router.post('/', auth, isRestaurant, async (req, res) => {
  try {
    const restaurant = new Restaurant({
      ...req.body,
      owner: req.userId
    });

    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update restaurant
router.put('/:id', auth, isRestaurant, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    if (restaurant.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(restaurant, req.body);
    await restaurant.save();

    res.json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get restaurant by owner
router.get('/owner/my-restaurant', auth, isRestaurant, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.userId });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
