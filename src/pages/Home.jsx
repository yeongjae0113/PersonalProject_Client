import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/Home.module.css';
import Employee from './Employee';
import Header from './Header';
import Chat from './Chat';
import Footer from './Footer';

const Home = () => {
    const navigate = useNavigate();
    const [isLoggin, setIsLoggin] = useState(false);
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState(null);
    const [selectChat, setSelectChat] = useState(null);
    const [messageInput, setMessageInput] = useState(''); // 메시지 입력 상태 추가

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            setIsLoggin(true);
            setUsername(parsedUser.username);
            setUserId(parsedUser.id);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsLoggin(false);
        setUsername('');
        setUserId(null);
        alert('로그아웃 성공');
    };

    const handleChatRoom = (chatRoomId) => {
        setSelectChat(chatRoomId);
    };

    const sendMessage = () => {
        if (messageInput.trim() && selectChat) {
            console.log('보낼 메시지:', messageInput);
            // 메시지 초기화
            setMessageInput('');
        }
    };

    return (
        <div className="app">
            <Header />
            <div className={styles.container}>
                <Employee 
                    username={username} 
                    userId={userId} 
                    handleLogout={handleLogout} 
                    selectChat={handleChatRoom}
                />
                <div className={styles.chat}>
                    {selectChat ? (
                        <Chat 
                            chatRoomId={selectChat}
                            messageInput={messageInput}
                            setMessageInput={setMessageInput}
                            sendMessages={sendMessage}
                        />
                    ) : (
                        <div>채팅방 선택하셈</div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
