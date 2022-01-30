import React from 'react';
import ReactDOM from 'react-dom';
import { Reservation } from './components/Reservation';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import Utils from '@date-io/dayjs';
import 'dayjs/locale/ja';
import { Dayjs } from 'dayjs';

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
    <Reservation />
  </MuiPickersUtilsProvider>,
  document.getElementById('container'),
);
