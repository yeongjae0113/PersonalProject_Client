import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/Header.module.css';
import logo from '../img/logo.png';

const Header = () => {
    const navigate = useNavigate();
    const [isLoggin, setIsLoggin] = useState(false);
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        const users = localStorage.getItem('userInfo');
        const userInfo = users;
        if (userInfo) {
            const parsedUser = JSON.parse(userInfo);
            setIsLoggin(true);
            setUsername(parsedUser.username);
            setRole(parsedUser.role);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
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
                        {role === 'ROLE_MASTER' && (
                            <button className={styles.organization} onClick={() => navigate('/administrators')}>관리자 모드</button>
                        )}
                        <button className={styles.calendar} onClick={() => navigate('/calendar')}>일정 관리</button>
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