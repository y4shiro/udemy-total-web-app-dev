import * as functions from 'firebase-functions';
import express = require('express');

const app = express();

app.get('/api', (req, res) => {
  res.send('hello firebase.');
});

export const fn = functions.https.onRequest(app);
