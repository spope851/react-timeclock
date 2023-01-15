import React from 'react';
import ReactDOM from 'react-dom/client';
import { Timeclock } from './components/timeclock';

const root = ReactDOM.createRoot(document.getElementById('react-timeclock'));
root.render(
  <React.StrictMode>
    <Timeclock />
  </React.StrictMode>
);
