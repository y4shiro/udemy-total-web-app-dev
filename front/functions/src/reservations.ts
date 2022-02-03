import express = require('express');
import { Firestore } from '@google-cloud/firestore';
import { IReservation } from './models/IReservation';
import dayjs = require('dayjs');
import tz = require('dayjs/plugin/timezone');

dayjs.extend(tz);
dayjs.tz.setDefault('Asia/Tokyo');

const firestore = new Firestore();
const getCollection = () => firestore.collection('reservations');

const app = express();

app.get('/', async (req, res) => {
  const dateString = req.query.date as string;
  const date = dayjs(dateString);

  if (!date.isValid()) {
    res.status(400).json({ message: 'date が必要です' });
    return;
  }

  const begin = date.startOf('day');
  const end = date.add(1, 'day').startOf('day');

  const snapshot = await getCollection()
    .where('startDate', '>=', begin.toDate())
    .where('startDate', '<=', end.toDate())
    .get();

  const reservations = snapshot.docs.map((doc) => {
    const data = doc.data() as IReservation;
    data.id = doc.id;
    return data;
  });

  res.json(reservations);
});

export default app;
