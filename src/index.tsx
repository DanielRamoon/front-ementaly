import './config/firebaseConfig';
import './index.css';
import './ReactCalendar.css';
import 'react-image-lightbox/style.css';
import 'react-toastify/dist/ReactToastify.css';
import ReactGA from 'react-ga4';

import MomentUtils from '@date-io/moment';
import { CssBaseline } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import React from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';

import App from './App';
import reportWebVitals from './reportWebVitals';

const TRACKING_ID = 'G-RQYB0E1K07'; // OUR_TRACKING_ID
ReactGA.initialize(TRACKING_ID);

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <App />
    </MuiPickersUtilsProvider>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    <ToastContainer />
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
