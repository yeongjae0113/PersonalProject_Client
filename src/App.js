import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import LoginForm from './pages/LoginForm';
import Chat from './pages/Chat';
import Calendar from './pages/Calendar';
import MyPage from './pages/MyPage';
import Change from './pages/Change';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/loginForm" element={<LoginForm />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/change" element={<Change />} />
    </Routes>
  );
};
export default App;
