import * as functions from 'firebase-functions';
import express = require('express');
import facilities from './facilities';
import reservations from './reservations';

const app = express();

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
