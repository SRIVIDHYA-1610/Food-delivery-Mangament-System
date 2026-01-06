import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, Home, Package, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary-600">🍔 FoodHub</div>
          </Link>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                {user.role === 'user' && (
                  <>
                    <Link to="/" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                      <Home size={20} />
                      <span>Home</span>
                    </Link>
                    <Link to="/orders" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                      <Package size={20} />
                      <span>Orders</span>
                    </Link>
                    <Link to="/cart" className="relative flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                      <ShoppingCart size={20} />
                      <span>Cart</span>
                      {getCartCount() > 0 && (
                        <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {getCartCount()}
                        </span>
                      )}
                    </Link>
                  </>
                )}
                {user.role === 'restaurant' && (
                  <>
                    <Link to="/restaurant-dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                      <LayoutDashboard size={20} />
                      <span>Dashboard</span>
                    </Link>
                    <Link to="/restaurant-orders" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                      <Package size={20} />
                      <span>Orders</span>
                    </Link>
                    <Link to="/menu-management" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                      <Home size={20} />
                      <span>Menu</span>
                    </Link>
                  </>
                )}
                <Link to="/profile" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                  <User size={20} />
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
