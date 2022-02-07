import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import superagent from 'superagent';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import Utils from '@date-io/dayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ja';

import { Routing } from './components/Routing';

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

ReactDOM.render(
  <MuiPickersUtilsProvider utils={ExtendedUtils} locale="ja">
    <BrowserRouter>
      <Routing />
    </BrowserRouter>
  </MuiPickersUtilsProvider>,
  document.getElementById('container'),
);
