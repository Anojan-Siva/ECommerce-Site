import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Store from './pages/Store';
import GameDetail from './pages/GameDetail';
import Cart from './pages/Cart';
import Deals from './pages/Deals';
import Survey from './pages/Survey';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<Store />} />
        <Route path="/game/:id" element={<GameDetail />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </CartProvider>
  );
}

export default App;
