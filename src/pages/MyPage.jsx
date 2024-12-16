import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Employee from './Employee';
import Footer from './Footer';
import styles from '../css/MyPage.module.css';

const MyPage = () => {
    const navigate = useNavigate();
    const [userInfo, setuserInfo] = useState({
        id: '',
        username: '',
        password: '',
        gender: '',
        age: '',
        phoneNumber: '',
        department: '',
        position: ''
    });

    // 전화번호 포맷팅 함수
    const formatPhoneNumber = (phoneNumber) => {
        if (!phoneNumber) return '';
        const cleaned = ('' + phoneNumber).replace(/\D/g, ''); // 숫자만 남김
        const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/); // 010-0000-0000 형식에 맞는 패턴
        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`; // 포맷팅
        }
        return phoneNumber; // 형식에 맞지 않으면 그대로 반환
    };

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        console.log('로컬 스토리지: ', userInfo);
        if (userInfo) {
            const parsedUserInfo = JSON.parse(userInfo);
            parsedUserInfo.phoneNumber = formatPhoneNumber(parsedUserInfo.phoneNumber)
            setuserInfo(parsedUserInfo); // JSON 파싱하여 상태에 저장
        } else {
            navigate('/'); // 유저 데이터가 없으면 홈으로 리다이렉트
        }
    }, [navigate]);

    return (
        <>
            <Header />
            <div className={styles.container}>
                <Employee 
                    username={userInfo.username}
                    userId={userInfo.id}
                />
                <div className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>이름</label>
                        <input
                            type="text"
                            name="username"
                            value={userInfo.username}
                            className={styles.readOnlyInput}
                            readOnly
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>비밀번호</label>
                        <input
                            type="password"
                            name="password"
                            value={userInfo.password}
                            className={styles.readOnlyInput}
                            readOnly
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>성별</label>
                        <input
                            type="text"
                            name="gender"
                            value={userInfo.gender}
                            className={styles.readOnlyInput}
                            readOnly
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>나이</label>
                        <input
                            type="number"
                            name="age"
                            value={userInfo.age}
                            className={styles.readOnlyInput}
                            readOnly
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>휴대전화</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={userInfo.phoneNumber}
                            className={styles.readOnlyInput}
                            readOnly
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>부서</label>
                        <input
                            type="text"
                            name="department"
                            value={userInfo.department}
                            className={styles.readOnlyInput}
                            readOnly
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>직급</label>
                        <input
                            type="text"
                            name="position"
                            value={userInfo.position}
                            className={styles.readOnlyInput}
                            readOnly
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
