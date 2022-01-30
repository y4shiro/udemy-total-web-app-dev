import React from 'react';
import { Link } from 'react-router-dom';

export const ReservationList: React.VFC = () => {
  return (
    <div>
      <p>
        <Link to="/reservation">予約詳細</Link>
      </p>
      <p>
        <Link to="/facility">設備詳細</Link>
      </p>
    </div>
  );
};
