import React, { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';

const CLIENT_ID = '242734956582-1913f7dj6355dusq2472svnc2o31rpi4.apps.googleusercontent.com'; // client id
const API_KEY = 'AIzaSyCH956VJAwd30lymDeG2ciGOoHaerMvHck'; // api key
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

function Calendar() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    function start() {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      }).then(() => {
        gapi.auth2.getAuthInstance().isSignedIn.listen(setIsSignedIn);
        setIsSignedIn(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
    }
    gapi.load('client:auth2', start);
  }, []);

  const handleAuthClick = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignOutClick = () => {
    gapi.auth2.getAuthInstance().signOut();
  };

  const listUpcomingEvents = () => {
    gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'maxResults': 10,
      'singleEvents': true,
      'orderBy': 'startTime',
    }).then((response) => {
      const events = response.result.items;
      setEvents(events);
    });
  };

  useEffect(() => {
    if (isSignedIn) {
      listUpcomingEvents();
    }
  }, [isSignedIn]);

  return (
    <div>
      <h1>Google Calendar Events</h1>
      {isSignedIn ? (
        <div>
          <button onClick={handleSignOutClick}>Sign Out</button>
          <ul>
            {events.map((event) => {
              const when = event.start.dateTime || event.start.date;
              return <li key={event.id}>{event.summary} ({when})</li>;
            })}
          </ul>
        </div>
      ) : (
        <button onClick={handleAuthClick}>Sign In with Google</button>
      )}
    </div>
  );
}

export default Calendar;
