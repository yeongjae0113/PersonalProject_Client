import React, { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Header from './Header';
import styles from '../css/Calendar.module.css';
import axios from 'axios';
import CalendarModal from './modal/CalendarModal';

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

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`http://localhost:8088/calendar?userId=${userInfo.id}`);
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
    try {
      const newEvent = {
        title,
        description,
        startDate,
        endDate: endDate || null,
        user: { id: userInfo.id },
      };

      const response = await axios.post('http://localhost:8088/calendar/save', newEvent);
      
      const updatedEvents =  [...events, {
        title: response.data.title,
        start: response.data.start,
        end: response.data.end,
        extendedProps: {
          description: response.data.description
        }
      }];
      setEvents(updatedEvents);
      setFilteredEvents(updatedEvents); 
      filterEventsByMonth(currentMonth);
      clearForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error('일정 생성 실패: ', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedEvent = {
        title: selectedEvent.title,
        description: selectedEvent.description,
        startDate: selectedEvent.start,
        endDate: selectedEvent.end || null,
        user: { id: userInfo.id },
      };

      const response = await axios.post(`http://localhost:8088/calendar/update/${selectedEvent.id}`, updatedEvent);

      const updatedEvents = events.map(event =>
        event.id === selectedEvent.id ? response.data : event
      );
      setEvents(updatedEvents);
      filterEventsByMonth(currentMonth);
      clearForm();
      setIsEventModalOpen(false);
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
          locale="ko"
          datesSet={(dateInfo) => {
            const month = dateInfo.start.getMonth();
            setCurrentMonth(month);
            filterEventsByMonth(month);
          }}
          eventContent={(eventInfo) => (
            <div>
              <div style={{fontSize: "16px", fontWeight: "bold", padding: "1px 0"}}>
                {eventInfo.event.title}
              </div>
            </div>
          )}
        />
        <CalendarModal
          isOpen={isModalOpen}
          isEvent={false}
          onClose={() => setIsModalOpen(false)}
          title={title}
          description={description}
          startDate={startDate}
          endDate={endDate}
          selectedEvent={selectedEvent}
          setTitle={setTitle}
          setDescription={setDescription}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          handleSave={handleSave}
          handleUpdate={handleUpdate}
        />
        <CalendarModal
          isOpen={isEventModalOpen}
          isEvent={true}
          onClose={() => setIsEventModalOpen(false)}
          title={title}
          description={description}
          startDate={startDate}
          endDate={endDate}
          selectedEvent={selectedEvent}
          setTitle={setTitle}
          setDescription={setDescription}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          handleSave={handleSave}
          handleUpdate={handleUpdate}
        />
      </div>
    </>
  );
};

export default Calendar;
