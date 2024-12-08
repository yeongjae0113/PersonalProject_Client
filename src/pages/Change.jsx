import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Employee  from './Employee';
import Footer from './Footer';
import styles from '../css/Change.module.css';

const Change = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
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
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setFormData(parsedUser);
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`http://localhost:8088/user/update/${formData.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: formData.id,
                    username: formData.username,
                    password: formData.password,
                    phoneNumber: formData.phoneNumber
                }),
            });

            if (!response.ok) {
                throw new Error('네트워크 응답이 좋지 않습니다.');
            }

            const result = await response.json();
            alert('사용자 정보가 수정되었습니다.');

            // 로컬 스토리지 업데이트
            localStorage.setItem('user', JSON.stringify({
                ...formData,
                password: formData.password // 비밀번호는 변경된 값으로 업데이트
            }));

        } catch (error) {
            console.error('Error:', error);
            alert('사용자 정보 수정 중 오류가 발생했습니다.');
        }
    };

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <Employee 
                    username={formData.username}
                    userId={formData.id}
                />
                <div className={styles.div}>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label>이름</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>비밀번호</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>성별</label>
                            <input
                                type="text"
                                name="gender"
                                value={formData.gender}
                                readOnly
                                className={`${styles.input} ${styles.readOnlyInput}`} // readOnlyInput 클래스 추가
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>나이</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                readOnly
                                className={`${styles.input} ${styles.readOnlyInput}`} // readOnlyInput 클래스 추가
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>휴대전화</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>부서</label>
                            <input
                                type="text"
                                name="department"
                                value={formData.department}
                                readOnly
                                className={`${styles.input} ${styles.readOnlyInput}`} // readOnlyInput 클래스 추가
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>직급</label>
                            <input
                                type="text"
                                name="position"
                                value={formData.position}
                                readOnly
                                className={`${styles.input} ${styles.readOnlyInput}`} // readOnlyInput 클래스 추가
                            />
                        </div>
                        <button type="submit" className={styles.button} onClick={() => navigate("/mypage")}>수정완료</button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Change;
