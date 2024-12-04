import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import LoginForm from './pages/LoginForm';
import Chat from './pages/Chat';
import Calendar from './pages/Calendar';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/loginForm" element={<LoginForm />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/calendar" element={<Calendar />} />
    </Routes>
  );
};
export default App;
