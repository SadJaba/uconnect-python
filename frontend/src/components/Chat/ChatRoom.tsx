import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import chatApi, { Message } from '../../api/chat';
import WebSocketClient from '../../api/websocket';

const ChatRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [message, setMessage] = useState('');
  const [wsClient, setWsClient] = useState<WebSocketClient | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Получаем сообщения
  const { data: messages = [] } = useQuery({
    queryKey: ['messages', roomId],
    queryFn: () => chatApi.getMessages(Number(roomId)).then(response => response.data),
  });

  // Мутация для отправки сообщения
  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => chatApi.sendMessage(Number(roomId), content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', roomId] });
    },
  });

  // Инициализация WebSocket
  useEffect(() => {
    if (roomId) {
      const client = new WebSocketClient(roomId);
      client.connect();
      setWsClient(client);

      const unsubscribe = client.onMessage((data) => {
        queryClient.invalidateQueries({ queryKey: ['messages', roomId] });
      });

      return () => {
        unsubscribe();
        client.disconnect();
      };
    }
  }, [roomId, queryClient]);

  // Прокрутка к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && wsClient) {
      const username = localStorage.getItem('username') || 'Anonymous';
      wsClient.sendMessage(message, username);
      sendMessageMutation.mutate(message);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg: Message) => (
          <div
            key={msg.id}
            className={`mb-4 ${
              msg.sender.username === localStorage.getItem('username')
                ? 'text-right'
                : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                msg.sender.username === localStorage.getItem('username')
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              <div className="font-bold">{msg.sender.username}</div>
              <div>{msg.content}</div>
              <div className="text-xs opacity-75">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Введите сообщение..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Отправить
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom; 