import React from 'react';
import styles from '../css/Employee.module.css';

const ChatRoomList = ({ chatRooms, userId, handleChatRoom }) => {
    return (
        <ul>
            {chatRooms.map(room => (
                <li key={room.chatRoomId} className={styles.chatRoomItem}>
                    <button className={styles.list} onClick={() => handleChatRoom(room.chatRoomId)}>
                        <div className={styles.usernames}>
                            {room.users.length > 0 && (
                                <span>
                                    {room.users
                                        .filter(user => user.id !== userId)
                                        .map((user, index) => (
                                            <span key={user.id}>
                                                {index > 0 && ', '}
                                                {user.username}
                                            </span>
                                        ))}
                                </span>
                            )}
                        </div>
                        <div className={styles.userCount}>
                            ({room.users.length}명)
                        </div>
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default ChatRoomList;
