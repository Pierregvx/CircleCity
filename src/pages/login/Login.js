import styles from "./login.module.css";
import {supabase} from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import abi from '../../abi.json'
import React, { useState, useEffect, useCallback } from "react";

const { ethers } = require("ethers");

const Login = (props) => {

  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);


  const connection = async () => {

    const {data, error} = await supabase
      .from('user')
      .select('password, address')
      .match({name: input})
    if(data[0].password === password){
      console.log("Connected");
      props.setPrivateKey(data[0].address)
      navigate("/dashboard");

    }else{
      console.log("Not connected")
      setError(true);
    }
  }
  return(
    <div className={styles.loginWrapper}>
      <h2>Login</h2>

      <p>Username</p>
      <input type="text" value={input} onChange={event => setInput(event.target.value)}/>
      <p>Password</p>
      <input type="password" value={password} onChange={event => setPassword(event.target.value)}/>
      {
        error ? <p>credentials false</p> : null
      }
      <button onClick={() => connection()}>Login</button>
    </div>
  )
}


export default Login;