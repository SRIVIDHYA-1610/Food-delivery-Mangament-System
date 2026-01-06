import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Store, MapPin, Phone, Clock, DollarSign } from 'lucide-react';

const RestaurantProfile = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisine: [],
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    deliveryTime: '30-40 mins',
    minimumOrder: 0,
    deliveryFee: 0,
    openingHours: '9:00 AM - 10:00 PM'
  });
  const [cuisineInput, setCuisineInput] = useState('');

  useEffect(() => {
    fetchRestaurant();
  }, []);

  const fetchRestaurant = async () => {
    try {
      const response = await axios.get('/api/restaurants/owner/my-restaurant');
      setRestaurant(response.data);
      setFormData({
        name: response.data.name,
        description: response.data.description,
        cuisine: response.data.cuisine,
        phone: response.data.phone,
        address: response.data.address || { street: '', city: '', state: '', zipCode: '' },
        deliveryTime: response.data.deliveryTime,
        minimumOrder: response.data.minimumOrder,
        deliveryFee: response.data.deliveryFee,
        openingHours: response.data.openingHours
      });
    } catch (error) {
      if (error.response?.status === 404) {
        setEditing(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [addressField]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddCuisine = () => {
    if (cuisineInput && !formData.cuisine.includes(cuisineInput)) {
      setFormData({ ...formData, cuisine: [...formData.cuisine, cuisineInput] });
      setCuisineInput('');
    }
  };

  const handleRemoveCuisine = (cuisine) => {
    setFormData({
      ...formData,
      cuisine: formData.cuisine.filter(c => c !== cuisine)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (restaurant) {
        await axios.put(`/api/restaurants/${restaurant._id}`, formData);
        toast.success('Restaurant profile updated successfully');
      } else {
        await axios.post('/api/restaurants', formData);
        toast.success('Restaurant profile created successfully');
      }
      fetchRestaurant();
      setEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save restaurant profile');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Restaurant Profile</h1>
        {restaurant && !editing && (
          <button onClick={() => setEditing(true)} className="btn-secondary">
            Edit Profile
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Restaurant Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Your Restaurant Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              className="input-field resize-none"
              placeholder="Describe your restaurant..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cuisine Types
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={cuisineInput}
                onChange={(e) => setCuisineInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCuisine())}
                className="input-field"
                placeholder="e.g., Italian, Chinese"
              />
              <button
                type="button"
                onClick={handleAddCuisine}
                className="btn-secondary"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.cuisine.map((cuisine, index) => (
                <span
                  key={index}
                  className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {cuisine}
                  <button
                    type="button"
                    onClick={() => handleRemoveCuisine(cuisine)}
                    className="text-primary-900 hover:text-primary-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="+1234567890"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              className="input-field"
              placeholder="Street Address"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                className="input-field"
                placeholder="City"
              />
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                className="input-field"
                placeholder="State"
              />
            </div>
            <input
              type="text"
              name="address.zipCode"
              value={formData.address.zipCode}
              onChange={handleChange}
              className="input-field"
              placeholder="ZIP Code"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Time
              </label>
              <input
                type="text"
                name="deliveryTime"
                value={formData.deliveryTime}
                onChange={handleChange}
                className="input-field"
                placeholder="30-40 mins"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opening Hours
              </label>
              <input
                type="text"
                name="openingHours"
                value={formData.openingHours}
                onChange={handleChange}
                className="input-field"
                placeholder="9:00 AM - 10:00 PM"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Order ($)
              </label>
              <input
                type="number"
                name="minimumOrder"
                value={formData.minimumOrder}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Fee ($)
              </label>
              <input
                type="number"
                name="deliveryFee"
                value={formData.deliveryFee}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="input-field"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button type="submit" className="btn-primary">
              {restaurant ? 'Update Profile' : 'Create Profile'}
            </button>
            {restaurant && (
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  fetchRestaurant();
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : restaurant ? (
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-start space-x-4 mb-4">
              <Store size={48} className="text-primary-600" />
              <div>
                <h2 className="text-2xl font-bold mb-1">{restaurant.name}</h2>
                <p className="text-gray-600">{restaurant.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {restaurant.cuisine.map((cuisine, index) => (
                <span
                  key={index}
                  className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
                >
                  {cuisine}
                </span>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Phone size={18} className="text-gray-400" />
                <span>{restaurant.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={18} className="text-gray-400" />
                <span>{restaurant.deliveryTime}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign size={18} className="text-gray-400" />
                <span>${restaurant.minimumOrder} minimum • ${restaurant.deliveryFee} delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={18} className="text-gray-400" />
                <span>{restaurant.openingHours}</span>
              </div>
            </div>

            {restaurant.address && (
              <div className="flex items-start space-x-2 mt-4 text-sm text-gray-600">
                <MapPin size={18} className="flex-shrink-0 mt-0.5" />
                <span>
                  {restaurant.address.street}, {restaurant.address.city},{' '}
                  {restaurant.address.state} {restaurant.address.zipCode}
                </span>
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-3">Restaurant Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Rating</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {restaurant.rating.toFixed(1)} ⭐
                </p>
                <p className="text-xs text-gray-500">{restaurant.totalRatings} ratings</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <p className={`text-lg font-semibold ${restaurant.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {restaurant.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default RestaurantProfile;
