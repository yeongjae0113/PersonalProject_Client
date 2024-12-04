import React, { useEffect } from 'react';
import axios from 'axios';

const DepartmentUserList = ({ department, username, setUsers }) => {

    // 부서별 사용자 목록 필터링
    useEffect(() => {
        const fetchUsers = async () => {
            if (department) {
                try {
                    const response = await axios.get(`http://localhost:8088/user/departmentList?department=${department}`);
                    const otherUsers = response.data.filter(e => e.username !== username);
                    setUsers(otherUsers);
                } catch (error) {
                    console.error('유저 목록 가져오지 못함', error);
                }
            }
        };
        fetchUsers();
    }, [department, username, setUsers]);

    return null; // 이 컴포넌트는 UI를 반환하지 않음
};

export default DepartmentUserList;
