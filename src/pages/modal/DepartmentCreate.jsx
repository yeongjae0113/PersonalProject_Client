import React from 'react';
import styles from '../../css/modal/DepartmentCreate.module.css';

const DepartmentCreate = ({
    isOpen,
    onClose,
    onSubmit,
    department,
    setDepartment,
    departmentNumber,
    setDepartmentNumber,
    departmentLocation,
    setDepartmentLocation,
}) => {
    if (!isOpen) return null; // 모달이 열려있지 않으면 렌더링하지 않음

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.h2}>부서 추가</h2>
                <form onSubmit={onSubmit} className={styles.form}>
                    <div className={styles.formGroup1}>
                        <label className={styles.label}>부서명</label>
                        <input
                            className={styles.input1}
                            type="text"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            placeholder="부서명"
                        />
                    </div>
                    <div className={styles.formGroup2}>
                        <label className={styles.label}>부서 번호</label>
                        <input
                            className={styles.input2}
                            type="text"
                            value={departmentNumber}
                            onChange={(e) => setDepartmentNumber(e.target.value)}
                            placeholder="부서 번호"
                        />
                    </div>
                    <div className={styles.formGroup2}>
                        <label className={styles.label}>부서 위치</label>
                        <input
                            className={styles.input3}
                            type="text"
                            value={departmentLocation}
                            onChange={(e) => setDepartmentLocation(e.target.value)}
                            placeholder="부서 위치"
                        />
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.buttons}>저장</button>
                        <button type="button" className={styles.buttons} onClick={onClose}>닫기</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DepartmentCreate;
