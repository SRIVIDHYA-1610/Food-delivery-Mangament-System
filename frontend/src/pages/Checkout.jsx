import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MapPin, Plus } from 'lucide-react';

const Checkout = () => {
  const { cart, restaurant, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
    if (user?.addresses?.length > 0) {
      const defaultAddr = user.addresses.find(addr => addr.isDefault) || user.addresses[0];
      setSelectedAddress(defaultAddr);
    }
  }, [cart, user]);

  const subtotal = getCartTotal();
  const deliveryFee = restaurant?.deliveryFee || 0;
  const tax = subtotal * 0.1;
  const total = subtotal + deliveryFee + tax;

  const handleAddAddress = async () => {
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode) {
      toast.error('Please fill all address fields');
      return;
    }

    try {
      const updatedAddresses = [...(user.addresses || []), newAddress];
      await axios.put('/api/auth/profile', { addresses: updatedAddresses });
      setSelectedAddress(newAddress);
      setShowAddressForm(false);
      toast.success('Address added successfully');
    } catch (error) {
      toast.error('Failed to add address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        restaurantId: restaurant._id,
        items: cart.map(item => ({
          menuItem: item._id,
          quantity: item.quantity
        })),
        deliveryAddress: selectedAddress,
        paymentMethod,
        specialInstructions
      };

      const response = await axios.post('/api/orders', orderData);
      toast.success('Order placed successfully!');
      clearCart();
      navigate(`/orders/${response.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Delivery Address</h2>
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="btn-secondary flex items-center space-x-1"
              >
                <Plus size={16} />
                <span>Add New</span>
              </button>
            </div>

            {showAddressForm && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
                <input
                  type="text"
                  placeholder="Label (e.g., Home, Work)"
                  value={newAddress.label}
                  onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Street Address"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="input-field"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="input-field"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="input-field"
                  />
                </div>
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={newAddress.zipCode}
                  onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                  className="input-field"
                />
                <button onClick={handleAddAddress} className="btn-primary">
                  Save Address
                </button>
              </div>
            )}

            <div className="space-y-3">
              {user?.addresses?.map((address, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedAddress(address)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedAddress === address
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <MapPin size={20} className="flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold">{address.label}</p>
                      <p className="text-sm text-gray-600">
                        {address.street}, {address.city}, {address.state} {address.zipCode}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="space-y-3">
              {['cash', 'card', 'online'].map((method) => (
                <label
                  key={method}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer ${
                    paymentMethod === method
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span className="capitalize">{method} on Delivery</span>
                </label>
              ))}
            </div>
          </div>

          {/* Special Instructions */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Special Instructions</h2>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Any special requests? (optional)"
              rows="3"
              className="input-field resize-none"
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || !selectedAddress}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
