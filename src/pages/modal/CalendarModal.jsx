import React, { useEffect, useRef } from 'react';
import styles from '../../css/modal/CalendarModal.module.css';

const CalendarModal = ({
  isOpen,
  isEvent,
  onClose,
  title,
  description,
  startDate,
  endDate,
  selectedEvent,
  setTitle,
  setDescription,
  setStartDate,
  setEndDate,
  handleSave,
  handleUpdate,
}) => {
  const titleRef = useRef(null);

  useEffect(() => {
    if (isOpen && !isEvent) {
      titleRef.current.focus();
    }
  }, [isOpen, isEvent]);

  if (!isOpen) return null;

  const handleTitleChange = (e) => {
    if (isEvent && selectedEvent) {
      setTitle(e.target.value);
    } else {
      setTitle(e.target.value);
    }
  };

  const handleDescriptionChange = (e) => {
    if (isEvent && selectedEvent) {
      setDescription(e.target.value);
    } else {
      setDescription(e.target.value);
    }
  };

  const handleStartDateChange = (e) => {
    if (isEvent && selectedEvent) {
      setStartDate(e.target.value);
    } else {
      setStartDate(e.target.value);
    }
  };

  const handleEndDateChange = (e) => {
    if (isEvent && selectedEvent) {
      setEndDate(e.target.value);
    } else {
      setEndDate(e.target.value);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.h2}>{isEvent ? '일정 수정' : '일정 추가'}</h2>
        <label className={styles.label}>제목</label>
        <input
          type="text"
          placeholder="일정 제목"
          value={isEvent ? selectedEvent?.title || '' : title}
          onChange={handleTitleChange}
          ref={titleRef}
          className={styles.inputField}
        />
        <label className={styles.label}>내용</label>
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

export default CalendarModal;
