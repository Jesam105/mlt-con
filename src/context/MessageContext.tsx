import React, { createContext, useContext, useState } from 'react';
import { Letter, CarePackage } from '../types';

interface MessageContextType {
  letters: Letter[];
  carePackages: CarePackage[];
  sendLetter: (senderId: string, senderName: string, recipientId: string, recipientName: string, content: string) => void;
  sendCarePackage: (senderId: string, senderName: string, recipientId: string, recipientName: string, items: { name: string, quantity: number }[], message: string) => void;
}

// Mock initial data
const initialLetters: Letter[] = [
  {
    id: '1',
    senderId: '2',
    senderName: 'Jane Doe',
    recipientId: '1',
    recipientName: 'John Doe',
    content: 'Hope you are doing well. Missing you a lot!',
    dateSent: '2023-04-10T14:48:00',
    isRead: true
  },
  {
    id: '2',
    senderId: '1',
    senderName: 'John Doe',
    recipientId: '2',
    recipientName: 'Jane Doe',
    content: 'Training is going well. Can\'t wait to see you soon.',
    dateSent: '2023-04-12T09:30:00',
    isRead: true
  }
];

const initialCarePackages: CarePackage[] = [
  {
    id: '1',
    senderId: '2',
    senderName: 'Jane Doe',
    recipientId: '1',
    recipientName: 'John Doe',
    items: [
      { id: '1', name: 'Homemade cookies', quantity: 24 },
      { id: '2', name: 'Favorite snacks', quantity: 10 },
      { id: '3', name: 'Photos from home', quantity: 5 }
    ],
    message: 'A little taste of home. Love you!',
    dateSent: '2023-04-05T10:20:00',
    status: 'delivered'
  }
];

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [letters, setLetters] = useState<Letter[]>(initialLetters);
  const [carePackages, setCarePackages] = useState<CarePackage[]>(initialCarePackages);

  const sendLetter = (
    senderId: string,
    senderName: string,
    recipientId: string,
    recipientName: string,
    content: string
  ) => {
    const newLetter: Letter = {
      id: String(Date.now()),
      senderId,
      senderName,
      recipientId,
      recipientName,
      content,
      dateSent: new Date().toISOString(),
      isRead: false
    };

    setLetters(prevLetters => [...prevLetters, newLetter]);
  };

  const sendCarePackage = (
    senderId: string,
    senderName: string,
    recipientId: string,
    recipientName: string,
    items: { name: string, quantity: number }[],
    message: string
  ) => {
    const newCarePackage: CarePackage = {
      id: String(Date.now()),
      senderId,
      senderName,
      recipientId,
      recipientName,
      items: items.map((item, index) => ({
        id: `${Date.now()}-${index}`,
        name: item.name,
        quantity: item.quantity
      })),
      message,
      dateSent: new Date().toISOString(),
      status: 'sent'
    };

    setCarePackages(prevPackages => [...prevPackages, newCarePackage]);
  };

  return (
    <MessageContext.Provider value={{ letters, carePackages, sendLetter, sendCarePackage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = (): MessageContextType => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};