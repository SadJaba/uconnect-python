import { api } from '../config';
import type { Broadcast } from '../types';

export const broadcastApi = {
  getBroadcasts: () =>
    api.get<Broadcast[]>('/broadcasts/'),

  createBroadcast: (title: string, content: string) =>
    api.post<Broadcast>('/broadcasts/', { title, content }),
}; 