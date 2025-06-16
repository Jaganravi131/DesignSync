import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  activeUsers: any[];
  joinDesign: (designId: string) => void;
  leaveDesign: () => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const { user, token } = useAuth();

  useEffect(() => {
    if (user && token) {
      const newSocket = io(SOCKET_URL, {
        auth: {
          token,
          userId: user.id
        }
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setIsConnected(false);
        setActiveUsers([]);
      });

      newSocket.on('error', (error) => {
        console.error('Socket error:', error);
        toast.error(error.message || 'Connection error');
      });

      newSocket.on('user-joined', (data) => {
        console.log('User joined:', data);
        toast.success(`${data.user.name} joined the design`);
        setActiveUsers(prev => [...prev.filter(u => u.id !== data.userId), data.user]);
      });

      newSocket.on('user-left', (data) => {
        console.log('User left:', data);
        setActiveUsers(prev => prev.filter(u => u.id !== data.userId));
      });

      newSocket.on('active-users', (users) => {
        console.log('Active users:', users);
        setActiveUsers(users);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user, token]);

  const joinDesign = (designId: string) => {
    if (socket && user && token) {
      socket.emit('join-design', {
        designId,
        userId: user.id,
        token
      });
    }
  };

  const leaveDesign = () => {
    if (socket) {
      socket.disconnect();
    }
  };

  return (
    <SocketContext.Provider value={{
      socket,
      isConnected,
      activeUsers,
      joinDesign,
      leaveDesign
    }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}