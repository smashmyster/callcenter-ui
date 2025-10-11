'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '@/types/contstants';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;

}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const newSocket = io(API_BASE_URL,
            {
            
            }
        );
        

        newSocket.on('connect', () => {
            setIsConnected(true);
        });

        newSocket.on("accountability_reminder", (message: string) => {
        })
     
        newSocket.on("userStatus", (message: string) => {
        })
        newSocket.on("data-received",(data)=>{
            console.log(data);
            
        })




        newSocket.on('disconnect', () => {
            setIsConnected(false);
        });
    }, []);
    useEffect(() => {

    }, []);
    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
}; 