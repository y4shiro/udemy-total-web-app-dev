import React, { useCallback, useContext } from 'react';
import dayjs from 'dayjs';

import { Button, makeStyles } from '@material-ui/core';
import { DoubleArrow } from '@material-ui/icons';
import { DatePicker } from '@material-ui/pickers';

import { CurrentDateContext } from './ReservationList';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

const useStyles = makeStyles(() => ({
  header: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startIcon: {
    transform: 'rotate(180deg)',
  },
  date: {
    '& input': { fontSize: '2rem', margin: 0, textAlign: 'center' },
  },
  weekday: {
    margin: 0,
    textAlign: 'center',
  },
  actions: {
    textAlign: 'right',
    position: 'relative',
    top: '-2em',
    marginBottom: '-1.5em',
  },
}));

export const ReservationListHeader: React.VFC = () => {
  const styles = useStyles();
  const { currentDate, dispatch } = useContext(CurrentDateContext);

  const changeDate = useCallback(
    (date: MaterialUiPickersDate) => {
      if (!date) return;
      dispatch({ payload: date, type: 'ChangeDate' });
    },
    [dispatch],
  );

  return (
    <div>
      <div className={styles.header}>
        <div>
          <Button startIcon={<DoubleArrow className={styles.startIcon} />}>
            1日前
          </Button>
        </div>
        <div>
          <DatePicker
            value={currentDate}
            className={styles.date}
            format="YYYY-MM-DD"
            onChange={changeDate}
          />
          <p className={styles.weekday}>{dayjs().format('dddd')}</p>
        </div>
        <div>
          <Button endIcon={<DoubleArrow />}>1日後</Button>
        </div>
      </div>

      <div className={styles.actions}>
        <Button variant="contained" color="primary">
          設備の登録
        </Button>
      </div>
    </div>
  );
};
