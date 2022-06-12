import './App.css';
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/login/Login";
import {Routes, Route} from "react-router-dom";
import {useState} from "react";

function App() {

  const [address, setAddress] = useState("");

  return (
    <Routes>
      <Route path="/" element={
        <Login getAddress={setAddress}/>
      }/>
      <Route path="dashboard" element={
        <Dashboard address={address}/>
      }/>
    </Routes>
  );
}

export default App;
