import * as React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

import cors from 'cors';

// const express = require('express');

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.post('/', (req,res) => {
//   const {name, context} = req.body;
//   res.json('test ok')
// });

// app.listen(3000);

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
