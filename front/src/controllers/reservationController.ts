import { Dayjs } from 'dayjs';
import agent from 'superagent';
import { IReservation } from '../models/IReservation';

export const getReservations = async (date: Dayjs): Promise<IReservation[]> => {
  const result = await agent
    .get('/api/reservations')
    .query({ date: date.toISOString() });

  return result.body as IReservation[];
};
