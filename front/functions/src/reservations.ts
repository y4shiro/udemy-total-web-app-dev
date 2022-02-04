import express = require('express');
import { DocumentReference, Firestore } from '@google-cloud/firestore';

import dayjs = require('dayjs');
import tz = require('dayjs/plugin/timezone');

import { IReservation } from './models/IReservation';
import { ISystem } from './models/ISystem';
import { IFacility } from './models/IFacility';

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

app.get('/:id', async (req, res) => {
  const id = req.params.id;
  const docRef = getCollection().doc(id);
  const snapshot = await docRef.get();

  if (!snapshot.exists) {
    res.status(404).send();
    return;
  }

  const data = snapshot.data() as IReservation;
  data.id = docRef.id;
  res.json(data);
});

// 日付型は JSON に無いので、受け取った文字列を変換する必要がある
// これはリクエストで受け取る JSON の型定義
type RequestReservation = Omit<IReservation, 'startDate' | 'endDate'> & {
  startDate: string;
  endDate: string;
};

// こちらは DB 側の型定義
type DbReservation = Omit<
  IReservation,
  'facilityId' | 'startDate' | 'endDate'
> & {
  facilityId: DocumentReference;
  startDate: Date;
  endDate: Date;
};

// リクエストの JSON を DB の型に変換する
const convertToDbType = (reqBody: RequestReservation): DbReservation => {
  const facility = firestore.doc('facilities/' + reqBody.facilityId);
  delete (reqBody as any).id;

  return {
    ...reqBody,
    facilityId: facility,
    startDate: new Date(reqBody.startDate),
    endDate: new Date(reqBody.endDate),
  };
};

app.post('/', async (req, res) => {
  const data = convertToDbType(req.body);
  const now = new Date();
  const addData = {
    ...data,
    system: {
      createDate: now,
      createUser: {
        displayName: '',
        email: '',
        face: '',
      },
      lastUpdate: now,
      lastUpdateUser: {
        displayName: '',
        email: '',
        face: '',
      },
    } as ISystem,
  };

  const docRef = await getCollection().add(addData);
  const snapshot = await docRef.get();
  res.json({ id: snapshot.id });
});

// 更新
app.put('/:id', async (req, res) => {
  const id = req.params.id;
  const data = convertToDbType(req.body);

  const docRef = getCollection().doc(id);
  const snapshot = await docRef.get();
  if (!snapshot.exists) {
    res.status(404).send();
    return;
  }

  const oldData = snapshot.data() as IFacility;
  const newData = {
    ...oldData,
    ...data,
    system: {
      ...oldData.system,
      lastUpdate: new Date(),
      lastUpdateUser: {
        displayName: '',
        email: '',
        face: '',
      },
    } as ISystem,
  };

  docRef.update(newData);
  res.status(204).send().end();
});

// 削除
app.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const docRef = getCollection().doc(id);
  await docRef.delete();
  res.status(204).send();
});

export default app;
