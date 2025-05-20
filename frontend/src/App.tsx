import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from './store';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/Profile';
import Chats from './pages/Chats';
import Broadcasts from './pages/Broadcasts';
import CreateChat from './pages/CreateChat';

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Auth routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected routes */}
            <Route element={<MainLayout />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/chats" element={<Chats />} />
              <Route path="/chats/new" element={<CreateChat />} />
              <Route path="/broadcasts" element={<Broadcasts />} />
            </Route>

            {/* Redirect to login by default */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
