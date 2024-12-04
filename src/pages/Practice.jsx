import React, { useState, useEffect } from 'react';
import Header from './Header';
import styles from '../css/Calendar.module.css';
import { gapi } from 'gapi-script';

const Calendar = () => {
    const [events, setEvents] = useState([]);
    const [isForm, setIsForm] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        handleClientLoad();
    }, []);

    function handleClientLoad() {
        gapi.load('client:auth2', initClient);
    }
    
    async function initClient() {
        try {
            await gapi.client.init({
                apiKey: process.env.REACT_APP_API_KEY, // 환경 변수 사용
                clientId: process.env.REACT_APP_CLIENT_ID, // 환경 변수 사용
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
                scope: 'https://www.googleapis.com/auth/calendar.readonly',
            });

            const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
            if (isSignedIn) {
                loadEvents();
            } else {
                gapi.auth2.getAuthInstance().signIn().then(loadEvents);
            }
        } catch (error) {
            console.error('클라이언트 초기화 오류: ', error);
            setError('클라이언트 초기화 중 오류가 발생했습니다.');
        }
    }
    
    const loadEvents = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await gapi.client.calendar.events.list({
                calendarId: 'primary',
                timeMin: (new Date()).toISOString(),
                maxResults: 10,
                singleEvents: true,
                orderBy: 'startTime',
            });

            if (response && response.result && response.result.items) {
                setEvents(response.result.items);
            } else {
                setEvents([]);
            }
        } catch (error) {
            console.error('일정 로드 에러: ', error);
            setError('일정을 로드하는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleDateClick = (dateStr) => {
        setDate(dateStr);
        setIsForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const event = {
            summary: title,
            description: description,
            start: {
                date: date,
            },
            end: {
                date: date,
            },
        };

        try {
            const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
            if (!isSignedIn) {
                await gapi.auth2.getAuthInstance().signIn();
            }

            await gapi.client.calendar.events.insert({
                calendarId: 'primary',
                resource: event,
            });

            loadEvents();
            setTitle('');
            setDescription('');
            setDate('');
            setIsForm(false);
        } catch (error) {
            console.error('일정 추가 에러: ', error);
            setError('일정을 추가하는 중 오류가 발생했습니다.');
        }
    };

    return (
        <>
            <Header />
            <div className={styles.container}>
                {loading && <p>로딩 중...</p>}
                {error && <p className={styles.error}>{error}</p>}
                {isForm && (
                    <form onSubmit={handleSubmit}>
                        <input
                            type='text'
                            placeholder='일정 제목'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <input
                            type='text'
                            placeholder='일정 내용'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)} 
                            required
                        />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                        <button type='submit'>일정 추가</button>
                        <button type='button' onClick={() => setIsForm(false)}>취소</button>
                    </form>
                )}
                <div>
                    {events.map(event => (
                        <div key={event.id}>
                            <h3>{event.summary}</h3>
                            <p>{event.description}</p>
                            <p>{event.start.date || event.start.dateTime}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Calendar;