import { useState } from 'react';
import { ChatBubbleLeftIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import chatApi, { ChatRoom, Message } from '../api/chat';
import WebSocketClient from '../api/websocket';

const Chats = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [wsClient, setWsClient] = useState<WebSocketClient | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Получаем список чатов
  const { data: chatRooms = [] } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: () => chatApi.getChatRooms().then(response => response.data),
  });

  // Получаем сообщения для выбранного чата
  const { data: messages = [] } = useQuery({
    queryKey: ['messages', selectedChat],
    queryFn: () => selectedChat ? chatApi.getMessages(selectedChat).then(response => response.data) : Promise.resolve([]),
    enabled: !!selectedChat,
  });

  // Мутация для отправки сообщения
  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => {
      if (!selectedChat) throw new Error('No chat selected');
      return chatApi.sendMessage(selectedChat, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', selectedChat] });
    },
  });

  // Инициализация WebSocket при выборе чата
  const handleSelectChat = (chatId: number) => {
    if (wsClient) {
      wsClient.disconnect();
    }
    setSelectedChat(chatId);
    const client = new WebSocketClient(chatId.toString());
    client.connect();
    setWsClient(client);

    client.onMessage(() => {
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !wsClient || !selectedChat) return;

    const username = localStorage.getItem('username') || 'Anonymous';
    wsClient.sendMessage(message, username);
    sendMessageMutation.mutate(message);
    setMessage('');
  };

  const selectedChatObj = chatRooms.find((c) => c.id === selectedChat);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Список чатов */}
      <div className="w-80 border-r border-gray-200 bg-gradient-to-b from-indigo-50 to-white overflow-y-auto">
        <div className="p-4">
          <Link
            to="/chats/new"
            className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold shadow hover:from-indigo-600 hover:to-pink-600 transition mb-6"
          >
            + Создать чат
          </Link>
          <h2 className="text-lg font-bold text-indigo-700 mb-2">Чаты</h2>
          <div className="divide-y divide-gray-200">
            {chatRooms.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className={`w-full p-3 text-left flex items-center gap-2 rounded-lg transition-all mb-1 ${
                  selectedChat === chat.id ? 'bg-indigo-100 shadow text-indigo-900' : 'hover:bg-indigo-50 text-gray-700'
                }`}
              >
                <ChatBubbleLeftIcon className="h-5 w-5 text-indigo-400" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{chat.name}</span>
                    <span className="text-xs text-gray-500">
                      {chat.participants.length} участников
                    </span>
                  </div>
                  {chat.messages.length > 0 && (
                    <span className="text-xs text-gray-500">
                      {chat.messages[chat.messages.length - 1].content}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Область чата */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        {selectedChat ? (
          <>
            <div className="flex items-center px-6 py-4 border-b border-gray-200 bg-white/80 shadow-sm">
              <span className="font-bold text-lg text-indigo-700">
                {selectedChatObj?.name}
              </span>
            </div>
            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-2">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender.username === localStorage.getItem('username')
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-2xl shadow text-sm ${
                        msg.sender.username === localStorage.getItem('username')
                          ? 'bg-indigo-500 text-white rounded-br-none'
                          : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                      }`}
                    >
                      <div className="mb-1">
                        <span className="font-semibold">{msg.sender.username}</span>
                        <span className="ml-2 text-xs text-gray-400">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div>{msg.content}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 mt-10">Нет сообщений</div>
              )}
            </div>
            <div className="border-t border-gray-200 p-4 bg-white/80">
              <form onSubmit={handleSendMessage} className="flex space-x-4">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Введите сообщение..."
                  className="flex-1 rounded-full border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                />
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Отправить
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">
            Выберите чат для начала общения
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats; 