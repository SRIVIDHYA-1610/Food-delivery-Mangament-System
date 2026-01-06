import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket && user) {
      // Join user-specific room
      socket.emit('join_user_room', user.id);

      // Listen for order status updates
      socket.on('order_status_update', (data) => {
        toast.success(`Order status updated to: ${data.status}`);
      });

      // If user is a restaurant owner, join restaurant room
      if (user.role === 'restaurant') {
        // You would need to fetch the restaurant ID here
        // For now, we'll handle this in the restaurant dashboard
      }

      socket.on('new_order', (order) => {
        toast.success('New order received!');
      });
    }
  }, [socket, user]);

  const value = {
    socket
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
