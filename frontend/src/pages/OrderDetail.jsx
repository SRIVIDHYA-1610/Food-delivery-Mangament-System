import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import { MapPin, Phone, Clock, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  useEffect(() => {
    fetchOrder();
  }, [id]);

  useEffect(() => {
    if (socket) {
      socket.on('order_status_update', (data) => {
        if (data.orderId === id) {
          setOrder(prev => ({ ...prev, status: data.status }));
        }
      });
    }
  }, [socket, id]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`/api/orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
      preparing: 'bg-purple-100 text-purple-800 border-purple-300',
      ready: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      out_for_delivery: 'bg-orange-100 text-orange-800 border-orange-300',
      delivered: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const formatStatus = (status) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const statusSteps = [
    { key: 'pending', label: 'Order Placed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'ready', label: 'Ready' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' }
  ];

  const getCurrentStepIndex = () => {
    if (!order) return 0;
    return statusSteps.findIndex(step => step.key === order.status);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const currentStep = getCurrentStepIndex();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Order Details</h1>
        <p className="text-gray-600">Order #{order._id.slice(-8).toUpperCase()}</p>
      </div>

      {/* Order Status Timeline */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-6">Order Status</h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <div key={step.key} className="relative flex items-center mb-6 last:mb-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                  isCompleted ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {isCompleted ? '✓' : index + 1}
                </div>
                <div className="ml-4">
                  <p className={`font-medium ${isCurrent ? 'text-primary-600' : ''}`}>
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p className="text-sm text-gray-600">Current status</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Restaurant Info */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Restaurant</h2>
          <div className="space-y-3">
            <p className="font-medium text-lg">{order.restaurant.name}</p>
            {order.restaurant.phone && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone size={16} />
                <span>{order.restaurant.phone}</span>
              </div>
            )}
            {order.restaurant.address && (
              <div className="flex items-start space-x-2 text-gray-600">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span className="text-sm">
                  {order.restaurant.address.street}, {order.restaurant.address.city}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Info */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
          <div className="flex items-start space-x-2 text-gray-600">
            <MapPin size={16} className="mt-1 flex-shrink-0" />
            <div>
              <p>{order.deliveryAddress.street}</p>
              <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}</p>
            </div>
          </div>
          {order.estimatedDeliveryTime && (
            <div className="flex items-center space-x-2 text-gray-600 mt-3">
              <Clock size={16} />
              <span className="text-sm">
                Est. delivery: {new Date(order.estimatedDeliveryTime).toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
              <div className="flex items-center space-x-3">
                {item.menuItem?.image && (
                  <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden">
                    <img src={item.menuItem.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>
        <div className="space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery Fee</span>
            <span>${order.deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax</span>
            <span>${order.tax.toFixed(2)}</span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary-600">${order.total.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex justify-between text-gray-600 text-sm">
            <span>Payment Method</span>
            <span className="capitalize">{order.paymentMethod}</span>
          </div>
        </div>

        {order.specialInstructions && (
          <div className="mt-4 p-3 bg-gray-50 rounded">
            <p className="text-sm font-medium text-gray-700 mb-1">Special Instructions:</p>
            <p className="text-sm text-gray-600">{order.specialInstructions}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
