import React, { useEffect, useState } from 'react';
import styles1 from '../css/Administrators.module.css';
import styles2 from '../css/Employee.module.css';
import Header from './Header';
import Footer from './Footer';
import DepartmentUserList from './DepartmentUserList';
import axios from 'axios';
import DepartmentCreate from './modal/DepartmentCreate';
import EmployeeCreate from './modal/EmployeeCreate';

const Administrators = ({ username }) => {
    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const [department, setDepartment] = useState('');
    const [users, setUsers] = useState([]);
    const [departmentNumber, setDepartmentNumber] = useState('');
    const [departmentLocation, setDepartmentLocation] = useState('');
    const [departments, setDepartments] = useState([]);

    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [userId2, setUserId2] = useState('');
    const [password2, setPassword2] = useState('');
    const [username2, setUsername2] = useState('');
    const [gender2, setGender2] = useState('');
    const [age2, setAge2] = useState('');
    const [phoneNumber2, setPhoneNumber2] = useState('');
    const [department2, setDepartment2] = useState('');
    const [position2, setPosition2] = useState('');
    const [user, setUser] = useState([]);

    // DB에서 부서 가져오기
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('http://localhost:8088/department/list');
                setDepartments(response.data);
                console.log("부서들: ", response.data);
            } catch (error) {
                console.log('부서 가져오지 못함', error);
            }
        };
        fetchDepartments();
    }, []);

    const handleSubmit1 = async (e) => {
        e.preventDefault();
        const departmentData = {
            department,
            departmentNumber,
            departmentLocation,
            headcount: 0,
        };

        try {
            const response = await axios.post('http://localhost:8088/department/create', departmentData);
            console.log('부서 생성 성공: ', response.data);
            alert('부서 생성 성공');
            
            // 부서 목록 업데이트
            setDepartments(prevDepartments => [...prevDepartments, response.data]);

            // 부서 추가 후 상태 초기화
            setDepartment('');
            setDepartmentNumber('');
            setDepartmentLocation('');
            
            setIsModalOpen1(false);
        } catch (error) {
            console.log('부서 생성 실패: ', error);
            alert('부서 생성 실패');
        }
    };

    const handleSubmit2 = async (e) => {
        e.preventDefault();

        // 필수 값들 확인
        if (!userId2 || !password2 || !username2 || !gender2 || !age2 || !phoneNumber2 || !department2 || !position2) {
            alert("모든 필드를 채워주세요.");
            return;
        }

        const userInfo = {
            userId: userId2, // 수정: JSON 키를 백엔드와 일치시킴
            password: password2,
            username: username2,
            gender: gender2,
            age: parseInt(age2, 10),
            phoneNumber: phoneNumber2.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'),
            position: position2,
            department: { department: department2 } // 수정: department 객체 구조 변경
        };

        try {
            const response = await axios.post('http://localhost:8088/user/join', userInfo);
            console.log('보내는 사원 정보: ', userInfo);
            console.log('사원 생성 성공: ', response.data);
            alert('사원 생성 성공');
            
            // 추가 후 상태 초기화
            setUserId2('');
            setPassword2('');
            setUsername2('');
            setGender2('');
            setAge2('');
            setPhoneNumber2('');
            setDepartment2('');
            setPosition2('');
            
            setIsModalOpen2(false);
            
        } catch (error) {
            console.log('사원 생성 실패: ', error);
            alert('사원 생성 실패');
        }
    }

    return (
        <>
            <Header />
            <div className={styles1.container}>
                <div className={styles1.departmentDiv}>
                    <div className={styles1.display}>
                        <div className={styles1.departmentList}>
                        <DepartmentUserList
                                department={department}
                                username={username}
                                setUsers={setUsers}
                                departments={departments}
                            />
                        </div>
                        <button className={styles1.button1} onClick={() => setIsModalOpen1(true)}>부서 추가</button>
                    </div>
                    <div className={styles1.display}>
                        <ul className={styles1.departmentList}>
                            {users.map(user => (
                                <li key={user.id} className={styles2.userItem}>
                                    <div className={styles2.userButtonContainer}>
                                        <button className={styles2.abc}>
                                            {user.username} ({user.position})
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <button className={styles1.button2} onClick={() => setIsModalOpen2(true)}>사원 추가</button>
                    </div>
                </div>
            </div>
            <Footer />

            <DepartmentCreate
                isOpen={isModalOpen1}
                onClose={() => setIsModalOpen1(false)}
                onSubmit={handleSubmit1}
                department={department}
                setDepartment={setDepartment}
                departmentNumber={departmentNumber}
                setDepartmentNumber={setDepartmentNumber}
                departmentLocation={departmentLocation}
                setDepartmentLocation={setDepartmentLocation}
            />
            <EmployeeCreate
                isOpen={isModalOpen2}
                onClose={() => setIsModalOpen2(false)}
                onSubmit={handleSubmit2}
                userId={userId2}
                setUserId={setUserId2}
                password={password2}
                setPassword={setPassword2}
                username={username2}
                setUsername={setUsername2}
                gender={gender2}
                setGender={setGender2}
                age={age2}
                setAge={setAge2}
                phoneNumber={phoneNumber2}
                setPhoneNumber={setPhoneNumber2}
                department={department2}
                setDepartment={setDepartment2}
                position={position2}
                setPosition={setPosition2}
            />
        </>
    );
};

export default Administrators;
