import * as functions from 'firebase-functions';
import express = require('express');
import facilities from './facilities';
import reservations from './reservations';

const app = express();

app.use('/api/facilities', facilities);
app.use('/api/Reservations', reservations);

export const fn = functions.https.onRequest(app);
