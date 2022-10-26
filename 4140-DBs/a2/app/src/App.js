import "./App.css";
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import PurchaseScreen from "./components/PurchaseScreen";

function App() {
  return (
    <div className="App">
      <Navbar />
      {/* <PurchaseScreen /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/purchase" element={<PurchaseScreen />} />
      </Routes>
    </div>
  );
}

export default App;
