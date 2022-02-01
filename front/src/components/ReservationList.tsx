import React, {
  createContext,
  Dispatch,
  Reducer,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import dayjs, { Dayjs } from 'dayjs';

import { makeStyles } from '@material-ui/core/styles';
import {
  indigo,
  lightBlue,
  lightGreen,
  orange,
  purple,
  red,
  teal,
  yellow,
} from '@material-ui/core/colors';

import { IFacility } from '../models/IFacility';
import { IReservation } from '../models/IReservation';
import { FacilityLane } from './FacilityLane';
import { ReservationListHeader } from './ReservationListHeader';

const dummyFacilities: IFacility[] = [
  {
    id: '01',
    name: '設備００１',
    // ダミーデータのため不必要なデータの定義は省略
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    system: {} as any,
    note: '',
  },
  {
    id: '02',
    name: '設備００２',
    // ダミーデータのため不必要なデータの定義は省略
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    system: {} as any,
    note: '',
  },
  {
    id: '03',
    name: '設備００３',
    // ダミーデータのため不必要なデータの定義は省略
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    system: {} as any,
    note: '',
  },
];

const dummyReservations: IReservation[] = [
  {
    id: '001',
    facilityId: '01',
    subject: '目的０１',
    description: '説明００１',
    startDate: dayjs('2021-04-05T09:00'),
    endDate: dayjs('2021-04-05T09:00').add(1, 'hour'),
    // ダミーデータのため不必要なデータの定義は省略
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    system: {} as any,
  },
  {
    id: '002',
    facilityId: '01',
    subject: '目的０２',
    description: '説明００１',
    startDate: dayjs('2021-04-05T11:00'),
    endDate: dayjs('2021-04-05T11:00').add(0.5, 'hour'),
    // ダミーデータのため不必要なデータの定義は省略
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    system: {} as any,
  },
  {
    id: '003',
    facilityId: '02',
    subject: '目的０３',
    description: '説明００１',
    startDate: dayjs('2021-04-05T14:00'),
    endDate: dayjs('2021-04-05T14:00').add(1.5, 'hour'),
    // ダミーデータのため不必要なデータの定義は省略
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    system: {} as any,
  },
  {
    id: '004',
    facilityId: '02',
    subject: '目的０４',
    description: '説明００１',
    startDate: dayjs('2021-04-05T16:00'),
    endDate: dayjs('2021-04-05T16:00').add(2, 'hour'),
    // ダミーデータのため不必要なデータの定義は省略
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    system: {} as any,
  },
  {
    id: '005',
    facilityId: '03',
    subject: '目的０５',
    description: '説明００１',
    startDate: dayjs('2021-04-05T10:00'),
    endDate: dayjs('2021-04-05T10:00').add(2.5, 'hour'),
    // ダミーデータのため不必要なデータの定義は省略
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    system: {} as any,
  },
];

const useStyles = makeStyles((theme) => ({
  lane: {
    border: `1px solid ${theme.palette.divider}`,
    borderBottom: 'none',
    display: 'flex',
    height: '40px',
    width: '100%',
    boxSizing: 'border-box',
    position: 'relative',
    '&:last-child': {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    '& .laneHeader': {
      borderRight: `1px solid ${theme.palette.divider}`,
      width: '100px',
      boxSizing: 'border-box',
      flexGrow: 0,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      padding: '0.5rem',
    },
    '& .timeCell': {
      borderRight: `1px solid ${theme.palette.divider}`,
      flexGrow: 1,
      flexBasis: 0,
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      '&:last-child': {
        borderRight: 'none',
      },
    },
  },
}));

const colors = [
  red[500],
  purple[500],
  indigo[500],
  lightBlue[500],
  teal[500],
  lightGreen[500],
  yellow[500],
  orange[500],
];

const getColor = (n: number) => {
  const index = n % 8;
  return colors[index];
};

// Context の Action を定義していく
type ActionType = 'ChangeDate' | 'NextDay' | 'PrevDay';

type Action = {
  type: ActionType;
  payload?: Dayjs;
};

// Context の Reducer を定義していく
type StateType = {
  currentDate: Dayjs;
};

const reducerProcessers: {
  [type in ActionType]: (s: StateType, a: Action) => StateType;
} = {
  ChangeDate: (s, a) => {
    return a.payload ? { ...s, currentDate: a.payload } : s;
  },

  NextDay: (s) => ({ ...s, currentDate: s.currentDate.add(1, 'day') }),

  PrevDay: (s) => ({ ...s, currentDate: s.currentDate.add(-1, 'day') }),
};

const reducer: Reducer<StateType, Action> = (state, action) => {
  return reducerProcessers[action.type](state, action);
};

type ContextType = {
  currentDate: Dayjs;
  dispatch: Dispatch<Action>;
};

export const CurrentDateContext = createContext<ContextType>({} as ContextType);

export const ReservationList: React.VFC = () => {
  const [state, dispatch] = useReducer(reducer, { currentDate: dayjs() });

  const cell = useRef<HTMLDivElement>(null);
  const [cellWidth, setCellWidth] = useState<number>(0);
  const styles = useStyles();

  const onResize = useCallback(() => {
    if (!cell?.current) return;
    setCellWidth(cell.current.getBoundingClientRect().width);
  }, [cell]);
  useEffect(onResize, [cell]);
  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const headerCells = useMemo(() => {
    const cells: JSX.Element[] = [];
    // 8 時のセルのみ useRef を適用
    cells.push(
      <div key={8} ref={cell} className="timeCell">
        8
      </div>,
    );

    for (let i = 9; i <= 19; i++) {
      cells.push(
        <div key={i} className="timeCell">
          {i}
        </div>,
      );
    }
    return cells;
  }, []);

  const lanes = useMemo(() => {
    return dummyFacilities.map((facility, index) => {
      const reservations = dummyReservations.filter(
        (r) => r.facilityId === facility.id,
      );
      return (
        <FacilityLane
          key={facility.id}
          cellWidth={cellWidth}
          facility={facility}
          reservations={reservations}
          className={styles.lane}
          backgroundColor={getColor(index)}
        />
      );
    });
  }, [styles.lane, cellWidth]);

  return (
    <div>
      <CurrentDateContext.Provider
        value={{ currentDate: state.currentDate, dispatch }}
      >
        <ReservationListHeader />
        <div>
          <div className={styles.lane}>
            <div className="laneHeader"></div>
            {headerCells}
          </div>
          {lanes}
        </div>
      </CurrentDateContext.Provider>
    </div>
  );
};
