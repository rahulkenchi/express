import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Login from './components/Login'
import Signup from './components/Signup'
import Home from './components/Home'
import { Container } from 'react-bootstrap';


function App() {
  const [login, setLogin] = useState(false);
  const [cart, setCart] = useState(false)
  function check() {
    setCart(true);
  }

  function check2() {
    setCart(false)
  }

  function logout() {
    setLogin(false)
  }

  function loggedin() {
    setLogin(true)
  }

  return (
    <BrowserRouter>
      <Container>
        <Navigation login={login} cart={cart} check2={check2} logout={logout} />
        <Routes>
          <Route path="/cart" element={<Cart check={check} />} />
          <Route path="/menu" element={<Menu check={check} />} />
          <Route path="/login" element={<Login login={login} loggedin={loggedin} />} />
          <Route path="/checkout" element={<Checkout check={check} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Container >
    </BrowserRouter>
  );
}

export default App;