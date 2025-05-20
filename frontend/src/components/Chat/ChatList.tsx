import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import chatApi, { ChatRoom } from '../../api/chat';

const ChatList: React.FC = () => {
  const { data: chatRooms = [] } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: () => chatApi.getChatRooms().then(response => response.data),
  });

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Чаты</h2>
        <Link
          to="/chats/new"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Создать чат
        </Link>
      </div>

      <div className="space-y-2">
        {chatRooms.map((room: ChatRoom) => (
          <Link
            key={room.id}
            to={`/chats/${room.id}`}
            className="block p-4 border rounded hover:bg-gray-50"
          >
            <div className="font-bold">{room.name}</div>
            <div className="text-sm text-gray-500">
              Участников: {room.participants.length}
            </div>
            {room.messages.length > 0 && (
              <div className="text-sm text-gray-600 truncate">
                Последнее сообщение: {room.messages[room.messages.length - 1].content}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatList; 