export type UserRole = 'spouse' | 'military';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  partnerId?: string;
  partnerName?: string;
}

export interface Letter {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  content: string;
  dateSent: string;
  isRead: boolean;
}

export interface CarePackage {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  items: CarePackageItem[];
  message: string;
  dateSent: string;
  status: 'sent' | 'in-transit' | 'delivered';
}

export interface CarePackageItem {
  id: string;
  name: string;
  quantity: number;
}