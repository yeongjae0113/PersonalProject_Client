import React, { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Header from './Header';
import styles from '../css/Calendar.module.css';
import axios from 'axios';

const Calendar = () => {
  const [events, setEvents] = useState([]); // 이벤트 목록
  const [selectDate, setSelectDate] = useState(null); // 선택한 날짜
  const [title, setTitle] = useState(''); // 일정 제목
  const [description, setDescription] = useState(''); // 일정 내용
  const [startDate, setStartDate] = useState(''); // 시작 날짜
  const [endDate, setEndDate] = useState(''); // 종료 날짜
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const titleRef = useRef(null); // 제목 입력 필드 참조
  const descriptionRef = useRef(null); // 내용 입력 필드 참조

  // 일정 데이터 가져오기
  const fetchEvent = async () => {
    try {
      const response = await axios.get('http://localhost:8088/calendar');
      setEvents(response.data); // 받아온 데이터를 상태에 저장
    } catch (error) {
      console.error('일정 가져오기 실패: ', error);
    }
  };

  // 초기화 및 유저 정보 가져오기
  useEffect(() => {
    fetchEvent();
  }, []);

  const handleDateClick = (info) => {
    setSelectDate(info.dateStr);
    setStartDate(info.dateStr);
    setEndDate(info.dateStr);
    setIsModalOpen(true); // 모달 열기
  };

  const handleSave = async () => {
    const user = JSON.parse(localStorage.getItem('user')); // 로컬 스토리지에서 유저 정보 가져오기

    if (!user || !user.id) {
      alert('유저 정보가 없습니다. 로그인 후 다시 시도해주세요.');
      return;
    }

    try {
      const newEvent = {
        title,
        description,
        startDate,
        endDate,
        user: { id: user.id } // 백엔드에서 요구하는 형식
      };

      const response = await axios.post('http://localhost:8088/calendar/save', newEvent);
      setEvents([...events, response.data]); // 새로운 이벤트를 추가
      clearForm(); // 폼 초기화
      setIsModalOpen(false); // 모달 닫기
    } catch (error) {
      console.error('일정 생성 실패: ', error);
    }
  };

  const clearForm = () => {
    setSelectDate(null);
    setTitle('');
    setDescription('');
    setStartDate('');
    setEndDate('');
  };

  const Modal = ({ isOpen, onClose }) => {
    useEffect(() => {
      if (isOpen) {
        titleRef.current.focus(); // 모달 열릴 때 제목 필드에 포커스
      }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <h3>일정 추가</h3>
          <input
            type="text"
            placeholder="일정 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            ref={titleRef}
          />
          <textarea
            placeholder="일정 내용"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            ref={descriptionRef}
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button className={styles.buttons} onClick={handleSave}>저장</button>
          <button
            className={styles.buttons}
            onClick={() => {
              clearForm();
              setIsModalOpen(false);
            }}
          >
            취소
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events} // 이벤트 표시
          dateClick={handleDateClick} // 날짜 클릭 이벤트
        />
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </>
  );
};

export default Calendar;
