import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // CSS 파일을 가져옵니다.
import App from './App';
// import Home from './pages/Home'
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';

// 강제 로그인 코드
// localStorage.setItem('userId', '1');
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
