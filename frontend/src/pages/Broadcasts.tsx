import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import chatApi, { Broadcast } from '../api/chat';

const Broadcasts = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const queryClient = useQueryClient();

  // Получаем список трансляций
  const { data: broadcasts = [] } = useQuery<Broadcast[]>({
    queryKey: ['broadcasts'],
    queryFn: () => chatApi.getBroadcasts().then(response => response.data),
  });

  // Мутация для создания трансляции
  const createBroadcastMutation = useMutation({
    mutationFn: (data: { title: string; description: string }) =>
      chatApi.createBroadcast(data.title, data.description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['broadcasts'] });
      setTitle('');
      setDescription('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    createBroadcastMutation.mutate({
      title: title.trim(),
      description: description.trim(),
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-indigo-700">Трансляции</h1>
        <Link
          to="/broadcasts/new"
          className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-lg hover:from-indigo-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Создать трансляцию
        </Link>
      </div>

      {/* Форма создания трансляции */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Создать новую трансляцию</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Название
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Введите название трансляции"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Описание
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Введите описание трансляции"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={createBroadcastMutation.isPending}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-lg hover:from-indigo-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {createBroadcastMutation.isPending ? 'Создание...' : 'Создать трансляцию'}
            </button>
          </div>
        </form>
      </div>

      {/* Список трансляций */}
      <div className="grid gap-6">
        {broadcasts.map((broadcast) => (
          <div
            key={broadcast.id}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{broadcast.title}</h3>
                <p className="text-sm text-gray-500">
                  Создал {broadcast.created_by.username} •{' '}
                  {new Date(broadcast.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {broadcast.participants} участников
              </span>
            </div>
            <p className="text-gray-600 mb-4">{broadcast.description}</p>
            <Link
              to={`/broadcasts/${broadcast.id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Присоединиться
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Broadcasts; 