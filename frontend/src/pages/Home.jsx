import { useState, useEffect } from 'react';
import axios from 'axios';
import RestaurantCard from '../components/RestaurantCard';
import { Search, Filter } from 'lucide-react';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [sortBy, setSortBy] = useState('');

  const cuisines = ['Italian', 'Chinese', 'Indian', 'Mexican', 'Japanese', 'American', 'Thai', 'Mediterranean'];

  useEffect(() => {
    fetchRestaurants();
  }, [search, selectedCuisine, sortBy]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCuisine) params.append('cuisine', selectedCuisine);
      if (sortBy) params.append('sort', sortBy);

      const response = await axios.get(`/api/restaurants?${params}`);
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Order Food from Your Favorite Restaurants
        </h1>
        <p className="text-xl text-gray-600">
          Fast delivery • Wide selection • Great prices
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search restaurants or cuisines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field w-48"
          >
            <option value="">Sort By</option>
            <option value="rating">Rating</option>
            <option value="deliveryTime">Delivery Time</option>
          </select>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter size={20} className="text-gray-600" />
          <button
            onClick={() => setSelectedCuisine('')}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedCuisine === '' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            All
          </button>
          {cuisines.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => setSelectedCuisine(cuisine)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCuisine === cuisine ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      {/* Restaurants Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : restaurants.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No restaurants found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
