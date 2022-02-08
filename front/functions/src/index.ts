import * as functions from 'firebase-functions';
import express = require('express');
import facilities from './facilities';
import reservations from './reservations';
import firebase = require('firebase-admin');
import { CustomReqType } from './models/CustomReqType';

firebase.initializeApp();

const app = express();

app.use((req, res, next) => {
  const authorization = req.headers.authorization || '';
  const idToken = authorization.split('Bearer ')[1];
  if (!idToken) {
    res.status(401).send('Authorization ヘッダが無いか、正しくありません。');
    return;
  }
  firebase
    .auth()
    .verifyIdToken(idToken)
    .then((decodedTdToken) => {
      (req as CustomReqType).user = {
        displayName: decodedTdToken.name || '',
        email: decodedTdToken.email || '',
        face: decodedTdToken.face || '',
      };
      next();
    })
    .catch(() => {
      res.status(401).send('トークンの認証に失敗しました');
    });
});

app.use('/api/facilities', facilities);
app.use('/api/Reservations', reservations);

app.get('/error', (req, res, next) => {
  next(new Error('エラーです'));
});

app.use(
  (
    error: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    if (res.headersSent) {
      return next(error);
    }
    res.status(500).send(error.message);
  },
);

export const fn = functions.https.onRequest(app);
