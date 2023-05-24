import './App.css';
import React from 'react';
import MainPage from './components/MainPage';
import { BrowserRouter } from 'react-router-dom';
import { StateContext } from './utilities/StateContext';

function App() {
  return (
    <BrowserRouter >
      <StateContext>
        <MainPage />
      </StateContext>
    </BrowserRouter>
  );
}

export default App;
