import React, { useEffect, useState } from 'react';
import styles from '../css/Employee.module.css';
import profile from '../img/profile.png';
import axios from 'axios';
import DepartmentUserList from './DepartmentUserList';
import ChatRoomList from './ChatRoomList';
import EmployeeInformation from './modal/EmployeeInformation';

const Employee = ({ username, userId, selectChat }) => {
    const [ users, setUsers ] = useState([]);
    const [ department, setDepartment ] = useState('');
    const [ chatRooms, setChatRooms ] = useState([]);
    const [ selectedUser, setSelectedUser   ] = useState(null);
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ departments, setDepartments ] = useState([]);

    // DB에서 부서 가져오기
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('http://localhost:8088/department/list')
                setDepartments(response.data);
                console.log("부서들: ", response.data)
            } catch (error) {
                console.log('부서 가져오지 못함', error);
            }
        };
        fetchDepartments();
    }, []);

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
        if (selectedUser && userId) {
            try {
                const response = await axios.post('http://localhost:8088/chat/create', [userId, selectedUser.id]);
                console.log('채팅방 생성:', response.data);
                // 채팅방 목록 갱신
                getChatRooms(userId);
                // 새로 생성된 채팅방으로 이동
                selectChat(response.data.chatRoomId);
            } catch (error) {
                console.error('채팅방 생성 실패', error);
            }
        } else {
            console.log("userId 또는 selectedUser.id가 없습니다. userId:", userId, "selectedUser:", selectedUser);
        }
    };

    const handleChatRoom = (chatRoomId) => {
        selectChat(chatRoomId);
    };

    // 더블 클릭으로 모달 열기
    const handleDoubleClick = (user) => {
        setSelectedUser(user);  // 더블 클릭한 유저 선택
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
    }
    

    return (
        <div className={styles.chatDiv}>
            <div className={styles.chatList}>
                <div className={styles.profileDiv}>
                    <img className={styles.profile} src={profile} alt='사진 못불러옴' />
                    <div className={styles.profileName}>{username}</div>
                </div>

                <DepartmentUserList 
                    department={department} 
                    username={username} 
                    setUsers={setUsers}
                    departments={departments} 
                />
                
                <ul>
                    {users.length > 0 &&
                        users.map(user => (
                            <li key={user.id} className={styles.userItem}>
                                <div className={styles.userButtonContainer}>
                                    <button className={styles.abc} onClick={() => handleUserClick(user)} onDoubleClick={() => handleDoubleClick(user)}>
                                        {user.username} ({user.position})
                                    </button>
                                    {selectedUser && selectedUser.id && user.id && selectedUser.id === user.id && (
                                        <button onClick={handleChatClick} className={styles.chatButton}>채팅</button>
                                    )}
                                </div>
                            </li>
                        ))
                    }
                </ul>
                
                {chatRooms.length > 0 && <h3>채팅방 목록</h3>}
                <ChatRoomList chatRooms={chatRooms} userId={userId} handleChatRoom={handleChatRoom} />
            </div>
            <EmployeeInformation 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                selectedUser={selectedUser}
            />
        </div>
    );
};

export default Employee;
