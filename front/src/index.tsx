import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

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

ReactDOM.render(
  <MuiPickersUtilsProvider utils={ExtendedUtils} locale="ja">
    <BrowserRouter>
      <Routing />
    </BrowserRouter>
  </MuiPickersUtilsProvider>,
  document.getElementById('container'),
);
