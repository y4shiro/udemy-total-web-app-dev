import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Reservation } from './Reservation';
import { Facility } from './Facility';
import { ReservationList } from './ReservationList';

export const Routing: React.VFC = () => {
  return (
    <Switch>
      <Route path="/reservation" component={Reservation} />
      <Route path="/facility" component={Facility} />
      <Route path="/" exact component={ReservationList} />
    </Switch>
  );
};
