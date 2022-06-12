import './App.css';
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/login/Login";
import {Routes, Route} from "react-router-dom";
import {useState} from "react";

function App() {

  const [privateKey, setPrivateKey] = useState("");

  return (
    <Routes>
      <Route path="/" element={
        <Login setPrivateKey={setPrivateKey}/>
      }/>
      <Route path="dashboard" element={
        <Dashboard privateKey={privateKey}/>
      }/>
    </Routes>
  );
}

export default App;
