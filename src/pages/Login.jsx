import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/Login.module.css';
import axios from 'axios';
import Header from './Header';

const Login = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get('http://localhost:8088/user/login', {
                params: { userId, password }
            });
            
            console.log('로그인 성공', response.data);
            alert('로그인 성공');
            localStorage.setItem('user', JSON.stringify(response.data));
            console.log('localStorage', localStorage)
            navigate('/');
        } catch (error) {
            console.error('로그인 실패', error);
            alert('로그인 실패했어');
        }
    }

    return (
        <>
        <Header />
            <form className={styles['login-container']} onSubmit={handleLogin}>
                <h2 className={styles.login}>Login</h2>
                <div>
                    <label className={styles.label}>아이디</label>
                    <input className={styles.input}
                        id='userId' 
                        type='text'
                        placeholder='아이디를 입력하세요'
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}>
                    </input>
                </div>
                <div>
                    <label className={styles.label}>비밀번호</label>
                    <input className={styles.input}
                        id='password'
                        type='password'
                        placeholder='비밀번호를 입력하세요'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}>
                    </input>
                </div>
                <div>
                    <button className={styles.buttons} type='submit'>로그인</button>
                    <button className={styles.buttons} onClick={() => navigate('/loginForm')}>회원가입</button>
                </div>
            </form>
        </>
    );
};

export default Login;