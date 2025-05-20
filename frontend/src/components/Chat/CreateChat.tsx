import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import chatApi from '../../api/chat';

const CreateChat: React.FC = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const createChatMutation = useMutation({
    mutationFn: (name: string) => chatApi.createChatRoom(name),
    onSuccess: (data) => {
      navigate(`/chats/${data.data.id}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      createChatMutation.mutate(name);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Создать новый чат</h2>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Название чата
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Введите название чата"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={createChatMutation.isPending}
        >
          {createChatMutation.isPending ? 'Создание...' : 'Создать чат'}
        </button>
      </form>
    </div>
  );
};

export default CreateChat; 