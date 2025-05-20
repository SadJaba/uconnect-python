import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import chatApi from '../api/chat';

const CreateChat = () => {
  const [name, setName] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [newParticipant, setNewParticipant] = useState('');
  const navigate = useNavigate();

  const createChatMutation = useMutation({
    mutationFn: (name: string) => chatApi.createChatRoom(name),
    onSuccess: () => {
      navigate('/chats');
    },
  });

  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (newParticipant.trim() && !participants.includes(newParticipant.trim())) {
      setParticipants([...participants, newParticipant.trim()]);
      setNewParticipant('');
    }
  };

  const handleRemoveParticipant = (username: string) => {
    setParticipants(participants.filter(p => p !== username));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createChatMutation.mutate(name.trim());
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">Создать новый чат</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Название чата
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Введите название чата"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Участники
          </label>
          <form onSubmit={handleAddParticipant} className="flex gap-2 mb-2">
            <input
              type="text"
              value={newParticipant}
              onChange={(e) => setNewParticipant(e.target.value)}
              className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Введите имя пользователя"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Добавить
            </button>
          </form>

          <div className="space-y-2">
            {participants.map((username) => (
              <div
                key={username}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <span className="text-gray-700">{username}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveParticipant(username)}
                  className="text-red-500 hover:text-red-700"
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/chats')}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={createChatMutation.isPending}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-lg hover:from-indigo-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {createChatMutation.isPending ? 'Создание...' : 'Создать чат'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateChat; 