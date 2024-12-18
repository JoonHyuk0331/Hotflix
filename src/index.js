import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import reportWebVitals from './reportWebVitals.js';
import { BrowserRouter } from 'react-router-dom';
import {QueryClient,QueryClientProvider} from "@tanstack/react-query"

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient= new QueryClient()
root.render(
  <QueryClientProvider client={queryClient}>
    {/* <React.StrictMode> */}
      <BrowserRouter> {/* BrowserRouter로 App을 감싸기 */}
        <App />
      </BrowserRouter>
    {/* </React.StrictMode> */}
  </QueryClientProvider>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
