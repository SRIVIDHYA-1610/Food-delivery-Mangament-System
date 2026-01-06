import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { Star, Clock, DollarSign, MapPin, Phone, Plus } from 'lucide-react';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart } = useCart();

  const categories = ['All', 'Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Salads', 'Soups', 'Sides', 'Specials'];

  useEffect(() => {
    fetchRestaurantDetails();
    fetchMenuItems();
  }, [id]);

  const fetchRestaurantDetails = async () => {
    try {
      const response = await axios.get(`/api/restaurants/${id}`);
      setRestaurant(response.data);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      toast.error('Failed to load restaurant details');
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`/api/menu/restaurant/${id}`);
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    const success = addToCart(item, restaurant);
    if (success) {
      toast.success(`${item.name} added to cart`);
    }
  };

  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-center text-xl text-gray-600">Restaurant not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Restaurant Header */}
      <div className="card mb-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="h-48 bg-gray-200 rounded-lg overflow-hidden">
              {restaurant.image ? (
                <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">🍽️</div>
              )}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
            <p className="text-gray-600 mb-4">{restaurant.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {restaurant.cuisine.map((cuisine, index) => (
                <span key={index} className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                  {cuisine}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Star className="text-yellow-500 fill-current" size={20} />
                <span>{restaurant.rating.toFixed(1)} ({restaurant.totalRatings} ratings)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={20} />
                <span>{restaurant.deliveryTime}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign size={20} />
                <span>${restaurant.minimumOrder} minimum • ${restaurant.deliveryFee} delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={20} />
                <span>{restaurant.phone}</span>
              </div>
            </div>

            {restaurant.address && (
              <div className="flex items-start space-x-2 mt-4 text-sm text-gray-600">
                <MapPin size={20} className="flex-shrink-0 mt-0.5" />
                <span>
                  {restaurant.address.street}, {restaurant.address.city}, {restaurant.address.state} {restaurant.address.zipCode}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredItems.map((item) => (
          <div key={item._id} className="card flex gap-4">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <div className="flex gap-1">
                  {item.isVegetarian && <span className="text-green-600 text-xs">🌱 Veg</span>}
                  {item.isVegan && <span className="text-green-600 text-xs">🌿 Vegan</span>}
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary-600">${item.price.toFixed(2)}</span>
                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={!item.isAvailable}
                  className="btn-primary flex items-center space-x-1 disabled:opacity-50"
                >
                  <Plus size={16} />
                  <span>Add</span>
                </button>
              </div>
              {!item.isAvailable && (
                <p className="text-red-500 text-sm mt-2">Currently unavailable</p>
              )}
            </div>
            {item.image && (
              <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No items found in this category</p>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;
