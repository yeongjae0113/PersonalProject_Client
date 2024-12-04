import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/Header.module.css';
import logo from '../img/logo.png';

const Header = () => {
    const navigate = useNavigate();
    const [isLoggin, setIsLoggin] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            setIsLoggin(true);
            setUsername(parsedUser.username);
        }
    }, []);
    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsLoggin(false);
        setUsername('');
        alert('로그아웃 성공');
    };

    return (
        <div className={styles.container}>
            <div className={styles.logoDiv} onClick={() => navigate('/')}>
                <img className={styles.logo} src={logo}></img>
                <div className={styles.logoName}>Pproject</div>
            </div>
            {/* <div onClick={() => navigate('/Calendar')}>
                일정관리
            </div> */}
            <div className={styles.login}>
                {isLoggin ? (
                    <div>
                        <span>{username}</span>
                        <button className={styles.logout} onClick={handleLogout}>로그아웃</button>
                    </div>
                    ) : (
                    <div>
                        <button onClick={() => navigate('/login')}>로그인</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;