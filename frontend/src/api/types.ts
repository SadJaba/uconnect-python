export interface User {
  id: number;
  username: string;
  email: string;
}

export interface ChatRoom {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  participants: number[];
}

export interface Message {
  id: number;
  chat_room: number;
  sender: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Broadcast {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  author: number;
} 