import { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, ShoppingBag, TrendingUp, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/api/orders/restaurant/analytics');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const revenueData = analytics?.revenueByDay ? 
    Object.entries(analytics.revenueByDay).map(([date, revenue]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: revenue
    })) : [];

  const statusData = analytics?.ordersByStatus ?
    Object.entries(analytics.ordersByStatus).map(([status, count]) => ({
      name: status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      value: count
    })) : [];

  const COLORS = ['#ef4444', '#3b82f6', '#8b5cf6', '#6366f1', '#f97316', '#10b981', '#6b7280'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Restaurant Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-primary-600">
                ${analytics?.totalRevenue?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="bg-primary-100 p-3 rounded-full">
              <DollarSign className="text-primary-600" size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Last 30 days</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-blue-600">
                {analytics?.totalOrders || 0}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <ShoppingBag className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Last 30 days</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Avg Order Value</p>
              <p className="text-2xl font-bold text-green-600">
                ${analytics?.averageOrderValue?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Average per order</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Pending Orders</p>
              <p className="text-2xl font-bold text-orange-600">
                {analytics?.ordersByStatus?.pending || 0}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Package className="text-orange-600" size={24} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Needs attention</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Revenue Trend (Last 7 Days)</h2>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Bar dataKey="revenue" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600 text-center py-12">No revenue data available</p>
          )}
        </div>

        {/* Orders by Status */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Orders by Status</h2>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600 text-center py-12">No order data available</p>
          )}
        </div>
      </div>

      {/* Popular Items */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Popular Items</h2>
        {analytics?.popularItems?.length > 0 ? (
          <div className="space-y-3">
            {analytics.popularItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                  <span className="font-medium">{item.name}</span>
                </div>
                <span className="text-gray-600">{item.count} orders</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No popular items data available</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
