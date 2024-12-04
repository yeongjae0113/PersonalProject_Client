import React, { useEffect, useState } from 'react';
import styles from '../css/Employee.module.css';
import profile from '../img/profile.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DepartmentUserList from './DepartmentUserList';
import ChatRoomList from './ChatRoomList';

const Employee = ({ username, userId, selectChat }) => {
    const [users, setUsers] = useState([]);
    const [department, setDepartment] = useState('');
    const [chatRooms, setChatRooms] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();

    // 로그인한 유저가 참여하고 있는 채팅방 목록 가져오기
    useEffect(() => {
        if (userId) {
            getChatRooms(userId);
        }
    }, [userId]);

    const getChatRooms = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8088/chat/chatRoom?userId=${userId}`);
            setChatRooms((prevChatRooms) => {
                const newRooms = response.data.filter(newRoom =>
                    !prevChatRooms.some(existingRoom => existingRoom.chatRoomId === newRoom.chatRoomId)
                );
                return [...prevChatRooms, ...newRooms];
            });
        } catch (error) {
            console.error('채팅방 목록 가져오지 못함', error);
        }
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
    };

    const handleChatClick = async () => {
        if (selectedUser) {
            try {
                const response = await axios.post('http://localhost:8088/chat/create', [userId, selectedUser.id]);
                console.log('채팅방 생성:', response.data);
                getChatRooms(userId);
                selectChat(response.data.chatRoomId);
            } catch (error) {
                console.error('채팅방 생성 실패', error);
            }
        }
    };

    const handleChatRoom = (chatRoomId) => {
        selectChat(chatRoomId);
    };

    const handleDepartmentClick = (dept) => {
        setDepartment(dept);
    };

    return (
        <div className={styles.chatDiv}>
            <div className={styles.chatList}>
                {/* <h3 className={styles.chatListName}></h3> */}
                <div className={styles.profileDiv}>
                    <img className={styles.profile} src={profile} alt='사진 못불러옴' />
                    <div className={styles.profileName}>{username}</div>
                </div>
                <div className={styles.department}>
                    <button className={styles.department1} onClick={() => handleDepartmentClick('인사팀')}>인사팀</button>
                    <button className={styles.department2} onClick={() => handleDepartmentClick('총무팀')}>총무팀</button>
                    <button className={styles.department3} onClick={() => handleDepartmentClick('개발팀')}>개발팀</button>
                </div>

                <DepartmentUserList department={department} username={username} setUsers={setUsers} />
                
                <ul>
                    {users.map(user => (
                        <li key={user.id} className={styles.userItem}>
                            <div className={styles.userButtonContainer}>
                                <button className={styles.abc} onClick={() => handleUserClick(user)}>
                                    {user.username} ({user.position})
                                </button>
                                {selectedUser && selectedUser.id === user.id && (
                                    <button onClick={handleChatClick} className={styles.chatButton}>채팅</button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
                
                <h3>채팅방 목록</h3>
                <ChatRoomList chatRooms={chatRooms} userId={userId} handleChatRoom={handleChatRoom} />
            </div>
        </div>
    );
};

export default Employee;