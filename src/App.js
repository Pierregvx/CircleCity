import './App.css';
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/login/Login";
import Validation from "./pages/validation/Validation";
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
      <Route path="success" element={
        <Validation/>
      }/>

    </Routes>
  );
}

export default App;
