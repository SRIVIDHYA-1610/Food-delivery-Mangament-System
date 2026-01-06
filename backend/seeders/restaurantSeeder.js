const User = require('../models/User');
const Restaurant = require('../models/Restaurant');

const seedRestaurants = async () => {
  try {
    // Check if restaurants already exist
    const existingRestaurants = await Restaurant.find();
    if (existingRestaurants.length > 0) {
      console.log('Restaurants already seeded');
      return;
    }

    // Sample restaurant owners data
    const restaurantOwners = [
      {
        name: 'Mario Rossi',
        email: 'mario@pizza.com',
        password: 'password123',
        phone: '555-0101'
      },
      {
        name: 'Sarah Chen',
        email: 'sarah@chinese.com',
        password: 'password123',
        phone: '555-0102'
      },
      {
        name: 'Ahmed Hassan',
        email: 'ahmed@middleeast.com',
        password: 'password123',
        phone: '555-0103'
      },
      {
        name: 'Emma Johnson',
        email: 'emma@burgers.com',
        password: 'password123',
        phone: '555-0104'
      }
    ];

    // Sample restaurants data
    const restaurantsData = [
      {
        name: 'Mario\'s Authentic Pizza',
        description: 'Traditional Italian pizza made with fresh ingredients and authentic recipes passed down through generations.',
        cuisine: ['Italian', 'Pizza'],
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001'
        },
        phone: '555-0101',
        deliveryTime: '25-35 mins',
        minimumOrder: 15,
        deliveryFee: 2.99,
        openingHours: '11:00 AM - 11:00 PM'
      },
      {
        name: 'Golden Dragon Chinese',
        description: 'Authentic Chinese cuisine featuring traditional dishes from various regions of China.',
        cuisine: ['Chinese', 'Asian'],
        address: {
          street: '456 Oak Ave',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94102'
        },
        phone: '555-0102',
        deliveryTime: '20-30 mins',
        minimumOrder: 20,
        deliveryFee: 3.99,
        openingHours: '10:00 AM - 10:00 PM'
      },
      {
        name: 'Middle East Flavors',
        description: 'Exquisite Middle Eastern cuisine with fresh ingredients and traditional cooking methods.',
        cuisine: ['Middle Eastern', 'Mediterranean'],
        address: {
          street: '789 Pine St',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601'
        },
        phone: '555-0103',
        deliveryTime: '30-40 mins',
        minimumOrder: 18,
        deliveryFee: 4.99,
        openingHours: '12:00 PM - 11:00 PM'
      },
      {
        name: 'Burger Barn',
        description: 'Juicy, handcrafted burgers made with premium beef and fresh ingredients.',
        cuisine: ['American', 'Burgers'],
        address: {
          street: '321 Elm St',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210'
        },
        phone: '555-0104',
        deliveryTime: '15-25 mins',
        minimumOrder: 12,
        deliveryFee: 2.49,
        openingHours: '9:00 AM - 9:00 PM'
      }
    ];

    // Create restaurant owners and their restaurants
    for (let i = 0; i < restaurantOwners.length; i++) {
      const ownerData = restaurantOwners[i];
      const restaurantData = restaurantsData[i];

      // Create restaurant owner user
      const owner = new User({
        ...ownerData,
        role: 'restaurant'
      });
      await owner.save();

      // Create restaurant
      const restaurant = new Restaurant({
        ...restaurantData,
        owner: owner._id
      });
      await restaurant.save();

      console.log(`Created restaurant: ${restaurant.name} with owner: ${owner.name}`);
    }

    console.log('Restaurant seeding completed successfully');
  } catch (error) {
    console.error('Error seeding restaurants:', error);
  }
};

module.exports = seedRestaurants;
