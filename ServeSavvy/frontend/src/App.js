import './App.css';
import React, {  } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from './views/HomePage';
import OrderPage from './views/OrderPage';
import Menu from './views/Menu';
import LogIn from './views/LogIn';
import Register from './views/Register';
import Category from './views/Category';


function App() {
  


  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/OrderPage/:boxId/:boxNumber" element={<OrderPage />} />
        <Route path="/Category/:categoryId/:categoryName" element={<Category />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;

