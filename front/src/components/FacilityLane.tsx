import React, { useMemo } from 'react';
import { Property } from 'csstype';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { IFacility } from '../models/IFacility';
import { IReservation } from '../models/IReservation';

import { ReservationBar } from './ReservationBar';

type Props = JSX.IntrinsicElements['div'] & {
  facility: IFacility;
  cellWidth: number;
  backgroundColor: Property.BackgroundColor;
  reservations: IReservation[];
};

const useStyles = makeStyles<
  Theme,
  { backgroundColor: Property.BackgroundColor }
>((theme) => ({
  header: {
    backgroundColor: (p) => p.backgroundColor,
    color: (p) => theme.palette.getContrastText(p.backgroundColor),
  },
}));

export const FacilityLane: React.VFC<Props> = (props) => {
  const { cellWidth, facility, reservations, backgroundColor, ...rootAttr } =
    props;
  const styles = useStyles({ backgroundColor });

  const cells = useMemo(() => {
    const r: JSX.Element[] = [];
    for (let i = 0; i <= 11; i++) {
      r.push(<div key={i} className="timeCell"></div>);
    }
    return r;
  }, []);

  const bars = useMemo(() => {
    return reservations.map((r) => {
      return (
        <ReservationBar
          key={r.id}
          backgroundColor={backgroundColor}
          beginHour={8}
          reservation={r}
          hourWidth={cellWidth}
          leftOffset={100}
        />
      );
    });
  }, [reservations, backgroundColor, cellWidth]);

  return (
    <div {...rootAttr}>
      {bars}
      <div className={`laneHeader ${styles.header}`}>
        <p>{facility.name}</p>
      </div>
      {cells}
    </div>
  );
};
