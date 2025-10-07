import * as React from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = React.createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => React.useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);

  React.useEffect(() => {
    // In development, we need to explicitly connect to the backend server.
    // In production, the server serves both, so we can connect to the same host.
    const socketUrl = import.meta.env.DEV ? 'http://localhost:3001' : '';
    
    const newSocket = io(socketUrl, {
      reconnectionAttempts: 5,
      reconnectionDelay: 5000,
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const contextValue = { socket, isConnected };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
