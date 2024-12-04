import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Employee from './Employee';
import Footer from './Footer';
import styles from '../css/MyPage.module.css';

const MyPage = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        id: '',
        username: '',
        password: '',
        gender: '',
        age: '',
        phoneNumber: '',
        department: '',
        position: ''
    });

    useEffect(() => {
        const storedUserData = localStorage.getItem('user');
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData)); // JSON 파싱하여 상태에 저장
        } else {
            navigate('/'); // 유저 데이터가 없으면 홈으로 리다이렉트
        }
    }, [navigate]);

    return (
        <>
            <Header />
            <div className={styles.container}>
                <Employee 
                    username={userData.username}
                    userId={userData.id}
                />
                <div className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>이름</label>
                        <input
                            type="text"
                            name="username"
                            value={userData.username}
                            className={styles.readOnlyInput}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>비밀번호</label>
                        <input
                            type="password"
                            name="password"
                            value={userData.password}
                            className={styles.readOnlyInput}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>성별</label>
                        <input
                            type="text"
                            name="gender"
                            value={userData.gender}
                            readOnly
                            className={styles.readOnlyInput}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>나이</label>
                        <input
                            type="number"
                            name="age"
                            value={userData.age}
                            readOnly
                            className={styles.readOnlyInput}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>휴대전화</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={userData.phoneNumber}
                            className={styles.readOnlyInput}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>부서</label>
                        <input
                            type="text"
                            name="department"
                            value={userData.department}
                            readOnly
                            className={styles.readOnlyInput}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>직급</label>
                        <input
                            type="text"
                            name="position"
                            value={userData.position}
                            readOnly
                            className={styles.readOnlyInput}
                        />
                    </div>
                    <div>
                        <button className={styles.button} onClick={() => navigate('/change')}>수정하기</button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MyPage;