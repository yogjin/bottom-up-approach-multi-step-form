import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App';
import './styles.css';
// import App2 from './yog/App2';
import NewApp from './new-approach/NewApp';

const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <NewApp />
  </React.StrictMode>
);
