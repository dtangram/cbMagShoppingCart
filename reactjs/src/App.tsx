import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MotoShopMenu from './components/MotoShopMenu';
import Home from './components/Home';
import MotoCart from './components/motoCart';

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <MotoShopMenu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/motoCart" element={<MotoCart />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;