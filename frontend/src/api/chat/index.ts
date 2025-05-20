import { api } from '../config';
import type { ChatRoom, Message } from '../types';

export const chatApi = {
  getChatRooms: () =>
    api.get<ChatRoom[]>('/chat/rooms/'),

  createChatRoom: (name: string, description: string) =>
    api.post<ChatRoom>('/chat/rooms/', { name, description }),

  getMessages: (roomId: number) =>
    api.get<Message[]>(`/chat/rooms/${roomId}/messages/`),

  sendMessage: (roomId: number, content: string) =>
    api.post<Message>(`/chat/rooms/${roomId}/messages/`, { content }),
}; 