import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/LoginForm.module.css';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

const LoginForm = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(['']);
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [department, setDepartment] = useState('');
    const [position, setPosition] = useState('');
    const navigate = useNavigate();

    
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 입력값 검증
        if (!userId || !password || !username || !age || !gender || !department || !position) {
            alert("빈칸 남기지마"); // 사용자에게 알림
            return; // 홈 페이지로 이동하지 않음
        }    
        
        // 전화번호 형식 변환
        const formattedPhoneNumber = phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');

        const userData = {
            userId,
            password,
            username,
            phoneNumber: formattedPhoneNumber, // 변환된 전화번호 사용
            age,
            gender,
            department,
            position
        };

        try {
            const response = await axios.post('http://localhost:8088/user/join', userData);
            console.log('회원가입 성공', response.data);
            alert('회원가입 성공')
            navigate('/login');
        } catch (error) {
            console.error('회원가입 실패', error);
            alert('회원가입에 실패했습니다. 다시 시도해주세요.'); // 사용자에게 알림
        }
    };

    return (
        <>
        <Header/>
            <form className={styles['login-container']} onSubmit={handleSubmit}>
                <h2 className={styles.title}>Join</h2>
                <div>
                    <label className={styles.label}>아이디</label>
                    <div>
                        <input 
                            className={styles.input} 
                            id='userId' 
                            type='text'
                            placeholder='아이디를 입력하세요'
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <label className={styles.label}>비밀번호</label>
                    <div>
                        <input
                            className={styles.input}
                            id='password'
                            type='password'
                            placeholder='비밀번호를 입력하세요'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <label className={styles.label}>이름</label>
                    <div>
                        <input
                            className={styles.input}
                            id='username'
                            type='text'
                            placeholder='이름을 입력하세요'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <label className={styles.label}>성별</label>
                    <div>
                        <label>
                            <input className={styles.radio} 
                                type='radio'
                                value='남성'
                                checked={gender === '남성'}
                                onChange={(e) => setGender(e.target.value)}
                            />
                            남성
                        </label>
                        <label>
                            <input className={styles.radio}  
                                type='radio'
                                value='여성'
                                checked={gender === '여성'}
                                onChange={(e) => setGender(e.target.value)}
                            />
                            여성
                        </label>
                    </div>
                </div>
                <div>
                    <label className={styles.label}>나이</label>
                    <div>
                        <input
                            className={styles.input}
                            id='age'
                            type='number'
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder='ex) 20'
                        />
                    </div>
                </div>
                <div>
                <label className={styles.label}>전화번호</label>
                    <div>
                        <input
                            className={styles.input}
                            id='phoneNumber'
                            type='text' // 하나의 입력 필드로 변경
                            value={phoneNumber}
                            onChange={(e) => {
                                const value = e.target.value;
                                // 숫자만 입력 가능하도록 필터링
                                if (/^\d*$/.test(value)) {
                                    setPhoneNumber(value); // 상태 업데이트
                                }
                            }}
                            placeholder='전화번호를 입력하세요 [ex) 01012345678]'
                        />
                    </div>
                </div>
                <div>
                    <label className={styles.label}>부서</label>
                    <div>
                        <select className={styles.select}
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}>
                            <option>선택</option>    
                            <option>인사팀</option>
                            <option>개발팀</option>
                            <option>총무팀</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label>직급</label>
                    <select 
                        className={styles.select}
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}>
                        <option>선택</option>
                        <option>사원</option>
                        <option>대리</option>
                        <option>과장</option>
                        <option>차장</option>
                        <option>부장</option>
                        <option>이사</option>
                    </select>
                </div>
                <div>
                    <button className={styles.button} type='submit'>회원가입</button>
                </div>
            </form>
            <div className={styles.footer}>
                <Footer />
            </div>
        </>
    );
};

export default LoginForm;
