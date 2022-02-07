import { Dayjs } from 'dayjs';
import agent from 'superagent';
import { IReservation } from '../models/IReservation';

export const getReservations = async (date: Dayjs): Promise<IReservation[]> => {
  const result = await agent
    .get('/api/reservations')
    .query({ date: date.toISOString() });

  return result.body as IReservation[];
};

export const getReservation = async (id: string): Promise<IReservation> => {
  const result = await agent.get(`/api/reservations/${encodeURIComponent(id)}`);
  return result.body as IReservation;
};

export const postReservation = async (
  reservation: IReservation,
): Promise<string> => {
  const result = await agent.post('/api/reservations').send(reservation);
  return result.body.id;
};

export const putReservation = async (
  reservation: IReservation,
): Promise<void> => {
  await agent
    .put(`/api/reservations/${encodeURIComponent(reservation.id)}`)
    .send(reservation);
};
