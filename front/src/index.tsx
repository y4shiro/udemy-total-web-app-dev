import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import superagent from 'superagent';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import Utils from '@date-io/dayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ja';

import { Routing } from './components/Routing';
import { Login } from './components/Login';
import firebase from 'firebase/app';
import 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAE-Afidy-FzOGuf18cK7R2I1mLlpW6-vY',
  authDomain: 'facility-reservations-f6ba3.firebaseapp.com',
  projectId: 'facility-reservations-f6ba3',
  storageBucket: 'facility-reservations-f6ba3.appspot.com',
  messagingSenderId: '718321852938',
  appId: '1:718321852938:web:4900a88de9cae4328bf5f3',
};
firebase.initializeApp(firebaseConfig);

dayjs.locale('ja');

class ExtendedUtils extends Utils {
  getCalendarHeaderText(date: Dayjs): string {
    return date.format('YYYY年 MMM');
  }
  getDateTimePickerHeaderText(date: Dayjs): string {
    return date.format('M/D');
  }
}

superagent.parse['application/json'] = (text: string) => {
  const obj = JSON.parse(text, (key, value) => {
    if (typeof value?._seconds === 'number') {
      return dayjs.unix(value._seconds);
    }
    if (value?._path?.segments?.[1]) {
      return value._path.segments[1];
    }
    return value;
  });
  return obj;
};

firebase.auth().onAuthStateChanged((user) => {
  ReactDOM.render(
    <MuiPickersUtilsProvider utils={ExtendedUtils} locale="ja">
      {!!user ? (
        <BrowserRouter>
          <Routing />
        </BrowserRouter>
      ) : (
        <Login />
      )}
    </MuiPickersUtilsProvider>,
    document.getElementById('container'),
  );
});
