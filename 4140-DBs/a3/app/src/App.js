import "./App.css";
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import PurchaseScreen from "./components/PurchaseScreen";
import ClientOrders from "./components/ClientOrders";
import OrderLines from "./components/OrderLines";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/purchase" element={<PurchaseScreen />} />
        <Route path="/orders" element={<ClientOrders />} />
        <Route path="/lines" element={<OrderLines />} />
      </Routes>
    </div>
  );
}

export default App;
