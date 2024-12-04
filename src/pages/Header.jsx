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
        navigate('/');
        alert('로그아웃 성공');
    };

    return (
        <div className={styles.container}>
            <div className={styles.logoDiv} onClick={() => navigate('/home')}>
                <img className={styles.logo} src={logo} alt="Logo" />
                <div className={styles.logoName}>Pproject</div>
            </div>
            <div className={styles.login}>
                {isLoggin ? (
                    <div className={styles.userDiv}>
                        <button className={styles.mypage} onClick={() => navigate('/mypage')}>
                            마이페이지
                        </button>
                        <span className={styles.username}>{username}</span>
                        <button className={styles.logout} onClick={handleLogout}>로그아웃</button>
                    </div>
                ) : (
                    <div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;