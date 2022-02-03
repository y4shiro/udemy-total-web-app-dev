import * as functions from 'firebase-functions';
import express = require('express');
import facilities from './facilities';

const app = express();

app.use('/api/facilities', facilities);

export const fn = functions.https.onRequest(app);
