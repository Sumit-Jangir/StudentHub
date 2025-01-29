import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import Students from './Components/Students';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/students" element={<Students />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
