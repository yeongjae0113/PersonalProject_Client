import React, { useEffect, useState } from 'react';
import styles from "../../css/modal/EmployeeInformation.module.css";
import axios from 'axios';

const EmployeeInformation = ({isOpen, onClose, selectedUser}) => {

    const [userInfo, setUserInfo] = useState({
        id: '',
        userId: '',
        password: '',
        username: '',
        gender: '',
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
        if (isOpen && selectedUser) {
            const userList = async () => {
                try {
                    const response = await axios.get('http://localhost:8088/user/list');
                    const user = response.data.find(user => user.id === selectedUser.id);
                    if (user) {
                        user.phoneNumber = formatPhoneNumber(user.phoneNumber);
                        setUserInfo(user);
                    }
                } catch (error) {
                    console.log("유저 정보 못가져옴: ", error);
                }
            }
            userList();
        }
    }, [isOpen, selectedUser]);

    if (!isOpen)
        return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div>
                    <div className={styles.formGroup2}>
                    <label className={styles.label}>이름</label>
                        <input className={styles.inputFeild} type='text' value={userInfo.username || ""} disabled />    
                    </div>
                    <div className={styles.formGroup2}>
                    <label className={styles.label}>부서</label>
                        <input className={styles.inputFeild} type='text' value={userInfo.department.department || ""} disabled />    
                    </div>
                    <div className={styles.formGroup2}>
                    <label className={styles.label}>직급</label>
                        <input className={styles.inputFeild} type='text' value={userInfo.position || ""} disabled />    
                    </div>
                    <div className={styles.formGroup2}>
                    <label className={styles.label}>나이</label>
                        <input className={styles.inputFeild} type='text' value={userInfo.age || ""} disabled />    
                    </div>
                    <div className={styles.formGroup2}>
                    <label className={styles.label}>성별</label>
                        <input className={styles.inputFeild} type='text' value={userInfo.gender || ""} disabled />    
                    </div>
                    <div className={styles.formGroup4}>
                    <label className={styles.label}>휴대전화</label>
                        <input className={styles.inputFeild} type='text' value={userInfo.phoneNumber || ""} disabled />    
                    </div>
                </div>
                <div className={styles.buttonGroup}>
                    <button type='button' className={styles.button} onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeInformation;