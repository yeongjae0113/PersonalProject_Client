import React, { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Header from './Header';
import styles from '../css/Calendar.module.css';
import axios from 'axios';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [selectDate, setSelectDate] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const titleRef = useRef(null);

  const fetchEvent = async () => {
    try {
      const response = await axios.get('http://localhost:8088/calendar');
      const formattedEvents = response.data.map(event => ({
        id: event.id,
        title: event.title,
        start: event.startDate,
        end: event.endDate 
          ? new Date(new Date(event.endDate).setDate(new Date(event.endDate).getDate() + 1)).toISOString().split('T')[0]
          : null,
        extendedProps: {
          description: event.description
        }
      }));
      setEvents(formattedEvents);
      setFilteredEvents(formattedEvents);
    } catch (error) {
      console.error('일정 가져오기 실패: ', error);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  const filterEventsByMonth = (month) => {
    const filtered = events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getMonth() === month;
    });
    setFilteredEvents(filtered);
  };

  const handleDateClick = (info) => {
    setSelectDate(info.dateStr);
    setStartDate(info.dateStr);
    setEndDate(info.dateStr);
    setIsModalOpen(true);
    setIsEventModalOpen(false);
  };

  const handleEventClick = (info) => {
    const event = info.event;
    const correctedEndDate = event.end 
      ? new Date(new Date(event.end).setDate(new Date(event.end).getDate()))
          .toISOString()
          .split('T')[0]
      : null;
    setSelectedEvent({
      id: event.id,
      title: event.title,
      description: event.extendedProps.description,
      start: event.startStr,
      end: correctedEndDate,
    });
    setIsEventModalOpen(true);
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user.id) {
      alert('유저 정보가 없습니다. 로그인 후 다시 시도해주세요.');
      return;
    }

    try {
      const newEvent = {
        title,
        description,
        startDate,
        endDate: endDate || null,
        user: { id: user.id },
      };

      const response = await axios.post('http://localhost:8088/calendar/save', newEvent);
      setEvents([...events, {
        title: response.data.title,
        start: response.data.startDate,
        end: response.data.endDate,
        extendedProps: {
          description: response.data.description
        }
      }]);
      clearForm();
      setIsModalOpen(false);
      filterEventsByMonth(currentMonth);
    } catch (error) {
      console.error('일정 생성 실패: ', error);
    }
  };

  const handleUpdate = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user.id) {
      alert('유저 정보가 없습니다. 로그인 후 다시 시도해주세요.');
      return;
    }

    try {
      const updatedEvent = {
        title: selectedEvent.title,
        description: selectedEvent.description,
        startDate: selectedEvent.start,
        endDate: selectedEvent.end || null,
        user: { id: user.id },
      };

      const response = await axios.post(`http://localhost:8088/calendar/update/${selectedEvent.id}`, updatedEvent);

      const updatedEvents = events.map(event =>
        event.id === selectedEvent.id ? response.data : event
      );
      setEvents(updatedEvents);

      clearForm();
      setIsEventModalOpen(false);
      filterEventsByMonth(currentMonth);
    } catch (error) {
      console.error('일정 수정 실패: ', error);
    }
  };

  const clearForm = () => {
    setSelectDate(null);
    setTitle('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setSelectedEvent(null);
  };

  const renderEventContent = (eventInfo) => (
    <div className={styles.schedule}>
      <div className={styles.titleClass}>{eventInfo.event.title}</div>
      <div className={styles.descriptionClass}>-{eventInfo.event.extendedProps.description}</div>
    </div>
  );

  const Modal = ({ isOpen, isEvent, onClose }) => {
    useEffect(() => {
      if (isOpen && !isEvent) {
        titleRef.current.focus();
      }
    }, [isOpen, isEvent]);

    if (!isOpen) return null;

    const handleTitleChange = (e) => {
      if (isEvent && selectedEvent) {
        setSelectedEvent({ ...selectedEvent, title: e.target.value });
      } else {
        setTitle(e.target.value);
      }
    };

    const handleDescriptionChange = (e) => {
      if (isEvent && selectedEvent) {
        setSelectedEvent({ ...selectedEvent, description: e.target.value });
      } else {
        setDescription(e.target.value);
      }
    };

    const handleStartDateChange = (e) => {
      if (isEvent && selectedEvent) {
        setSelectedEvent({ ...selectedEvent, start: e.target.value });
      } else {
        setStartDate(e.target.value);
      }
    };

    const handleEndDateChange = (e) => {
      if (isEvent && selectedEvent) {
        setSelectedEvent({ ...selectedEvent, end: e.target.value });
      } else {
        setEndDate(e.target.value);
      }
    };

    return (
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <h2 className={styles.h2}>{isEvent ? '일정 수정' : '일정 추가'}</h2>
          제목
          <input
            type="text"
            placeholder="일정 제목"
            value={isEvent ? selectedEvent?.title || '' : title}
            onChange={handleTitleChange}
            ref={titleRef}
            className={styles.inputField}
          />
          내용
          <textarea
            placeholder="일정 내용"
            value={isEvent ? selectedEvent?.description || '' : description}
            onChange={handleDescriptionChange}
            className={styles.textareaField}
          />
          <div className={styles.dateContainer}>
            <div className={styles.dateLabel1}>시작일</div>
            <input
              type="date"
              value={isEvent ? selectedEvent?.start || '' : startDate}
              onChange={handleStartDateChange}
              className={styles.inputDate}
            />
            <div className={styles.dateLabel2}>종료일</div>
            <input
              type="date"
              value={isEvent ? selectedEvent?.end || '' : endDate}
              onChange={handleEndDateChange}
              className={styles.inputDate}
            />
          </div>
          <div className={styles.buttonContainer}>
            {!isEvent && (
              <button className={styles.buttons} onClick={handleSave}>저장</button>
            )}
            {isEvent && (
              <button className={styles.buttons} onClick={handleUpdate}>수정</button>
            )}
            <button
              className={styles.buttons}
              onClick={() => {
                clearForm();
                onClose();
              }}
            >
              닫기
            </button>
          </div>
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
          events={filteredEvents}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          locale="ko"
          datesSet={(dateInfo) => {
            const month = dateInfo.start.getMonth();
            setCurrentMonth(month);
            filterEventsByMonth(month);
          }}
          dayCellDidMount={(info) => {
            info.el.style.height = '140px'; // 원하는 높이
            info.el.style.width = 'calc(100% / 7)';
            const date = new Date(info.date);
            if (date.getMonth() !== 11) {
              info.el.innerHTML = ''; // 비어 있는 상태로 표시
            }
          }}
        />
        <Modal
          isOpen={isModalOpen}
          isEvent={false}
          onClose={() => setIsModalOpen(false)}
        />
        <Modal
          isOpen={isEventModalOpen}
          isEvent={true}
          onClose={() => setIsEventModalOpen(false)}
        />
      </div>
    </>
  );
};

export default Calendar;
