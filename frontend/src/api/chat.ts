import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

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

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Broadcast {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  author: number;
}

const chatApi = {
  login: (username: string, password: string) =>
    axios.post(`${API_URL}/auth/login/`, { username, password }),

  register: (username: string, email: string, password: string) =>
    axios.post(`${API_URL}/auth/register/`, { username, email, password }),

  getChatRooms: () =>
    axios.get<ChatRoom[]>(`${API_URL}/chat/rooms/`, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    }),

  createChatRoom: (name: string, description: string) =>
    axios.post<ChatRoom>(
      `${API_URL}/chat/rooms/`,
      { name, description },
      {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
      }
    ),

  getMessages: (roomId: number) =>
    axios.get<Message[]>(`${API_URL}/chat/rooms/${roomId}/messages/`, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    }),

  sendMessage: (roomId: number, content: string) =>
    axios.post<Message>(
      `${API_URL}/chat/rooms/${roomId}/messages/`,
      { content },
      {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
      }
    ),

  getBroadcasts: () =>
    axios.get<Broadcast[]>(`${API_URL}/broadcasts/`, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    }),

  createBroadcast: (title: string, content: string) =>
    axios.post<Broadcast>(
      `${API_URL}/broadcasts/`,
      { title, content },
      {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
      }
    ),

  getCurrentUser: () =>
    axios.get<User>(`${API_URL}/auth/user/`, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    }),

  updateProfile: (username: string, email: string) =>
    axios.patch<User>(
      `${API_URL}/auth/user/`,
      { username, email },
      {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
      }
    ),

  changePassword: (current_password: string, new_password: string) =>
    axios.post(
      `${API_URL}/auth/change-password/`,
      { current_password, new_password },
      {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
      }
    ),
};

export default chatApi; 