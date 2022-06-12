import './App.css';
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/login/Login";
import Validation from "./pages/validation/Validation";
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
      <Route path="success" element={
        <Validation/>
      }/>

    </Routes>
  );
}

export default App;
