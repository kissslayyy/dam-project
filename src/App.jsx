import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import IoTDashboard from "./components/IoTDashboard";
import DamDetails from "./components/DamDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IoTDashboard />} />
        <Route path="/details" element={<DamDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
