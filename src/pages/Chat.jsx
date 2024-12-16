import React, { useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import styles from '../css/Chat.module.css';

const Chat = ({ chatRoomId, messageInput, setMessageInput, sendMessages }) => {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [id, setUserId] = useState(null);
    const stompClient = useRef(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            setUserId(userInfo.id);
        }

        const socket = new SockJS('http://localhost:8088/ws');
        stompClient.current = new Client({
            webSocketFactory: () => socket,
            onConnect: (frame) => {
                setIsConnected(true);
                console.log('WebSocket 연결 성공: ', frame);
                stompClient.current.subscribe(`/topic/public/${chatRoomId}`, (message) => {
                    const messageBody = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, messageBody]);
                });
            },
            onDisconnect: () => {
                console.log('WebSocket 연결 해제');
                setIsConnected(false);
            },
            onStompError: (frame) => {
                console.error('브로커 오류: ' + frame.headers['message']);
            }
        });

        stompClient.current.activate();

        return () => {
            if (stompClient.current) {
                stompClient.current.deactivate();
            }
        };
    }, [chatRoomId]);

    useEffect(() => {
        if (chatRoomId && id) {
            const fetchMessages = async () => {
                try {
                    const response = await axios.get(`http://localhost:8088/message/messageList/${chatRoomId}`);
                    if (Array.isArray(response.data)) {
                        setMessages(response.data);
                    }
                } catch (error) {
                    console.error('메시지 가져오기 오류: ', error);
                }
            };

            fetchMessages();
        }
    }, [chatRoomId, id]);

    const sendMessage = () => {
        if (isConnected && messageInput.trim() && id) {
            const chatMessage = {
                sender: { id: parseInt(id, 10) },
                chatRoomId: chatRoomId,
                messageText: messageInput,
            };

            stompClient.current.publish({
                destination: `/app/sendMessage/${chatRoomId}`,
                body: JSON.stringify(chatMessage),
            });

            setMessageInput('');
            sendMessages(messageInput); // 메시지를 보냈다는 것을 부모에게 알림
        } else {
            console.error('메시지를 전송할 수 없음, STOMP 클라이언트가 연결되지 않았습니다.');
        }
    };

    return (
        <>
            <div className={styles.chatRoomId}>채팅방 ID: {chatRoomId}</div>
            <div className={styles.messageList}>
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`${styles.message} ${msg.sender.id === id ? styles.sent : styles.received}`}
                    >
                        <strong>{msg.sender.username}: </strong>
                        {msg.messageText}
                    </div>
                ))}
            </div>
            <div className={styles.textSend}>
                <TextareaAutosize
                    className={styles.textarea}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="메시지를 입력하세요"
                    minRows={1}
                    maxRows={5}
                />
                <button className={styles.sendBtn} onClick={sendMessage}>전송</button>
            </div>
        </>
    );
};

export default Chat;
