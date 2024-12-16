import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../css/Employee.module.css';

const DepartmentUserList = ({ departments = [], setUsers }) => {
    const [ department, setDepartment ] = useState('');
    const [ username, setUsername ] = useState(''); // 로컬 스토리지에서 username을 가져옵니다.
    const [ selectedDepartment, setSelectedDepartment ] = useState(''); // 클릭된 부서를 상태로 관리
    
    // 부서별 사용자 목록 필터링
    useEffect(() => {
        const fetchUsers = async () => {
            if (department) {
                try {
                    const response = await axios.get(`http://localhost:8088/user/departmentList?department=${department}`);
                    const otherUsers = response.data.filter(e => e.username !== username); // 필터링된 사용자 목록
                    setUsers(otherUsers); // 상태 업데이트
                    console.log('응답: ', response.data); // 응답 확인
                } catch (error) {
                    console.error('유저 목록 가져오지 못함', error);
                }
            }
        };

        if (department) {  // department가 비어있지 않을 때만 API 호출
            fetchUsers();
        }
    }, [department, username, setUsers]); // department나 username 변경 시 호출

    const handleDepartmentClick = (dept) => {
        setDepartment(dept); // 부서 클릭 시 해당 부서 설정
        setSelectedDepartment(dept); // 클릭된 부서 상태 설정
    };

    return (
        <div className={styles.department}>
            {departments.map((dept, index) => (
                <button
                    key={index}
                    className={styles[`department1`]}
                    onClick={() => handleDepartmentClick(dept.department)}
                    style={{
                        backgroundColor: selectedDepartment === dept.department ? '#0073CF' : '#91b0d9',
                        color: 'white'
                    }}
                >
                    {dept.department}
                </button>
            ))}
        </div>
    );
};

export default DepartmentUserList;
