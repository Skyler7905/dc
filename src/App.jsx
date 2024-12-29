import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store'; 
import './App.css';
import Header from './component/Header';
import Hero from './component/Hero';
import Home from './component/Home';
import Channel from './component/Channel';  // Channel component handles navigation, not content rendering

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<><Header /><Hero /></>} />
          <Route path="/channels" element={<Home />} />
          <Route path="/channels/:id" element={<Home />} /> {/* Home will render content based on channel ID */}
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
