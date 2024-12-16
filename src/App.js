import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import LoginForm from './pages/LoginForm';
import Chat from './pages/Chat';
import Calendar from './pages/Calendar';
import MyPage from './pages/MyPage';
import Change from './pages/Change';
import Administrators from './pages/Administrators';
import GitLogo from './pages/GitLogo';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/change" element={<Change />} />
      <Route path="/gitLogo" element={<GitLogo />} />
      <Route path="/administrators" element={<Administrators />} />
    </Routes>
  );
};
export default App;
