import React, {useEffect, useState} from "react";
import styles from "./login.module.css";
import {supabase} from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import abi from '../../../abi.json'
import React, { useState, useEffect, useCallback } from "react";
const { ethers } = require("ethers");
const address = "0x5a6A370ACe53e633c81034562aF79540a2cF5BCE";
const provider = new ethers.providers.JsonRpcProvider("https://eth-rinkeby.alchemyapi.io/v2/CKWiEfWIkOb2lvcXSBCllnUW-mj4dy7c")

const admin = new ethers.Wallet("1a57200a0f4d469b9ac60b2857a595c5c7b00787e5fb1238a106113fe10b941d", provider);
const butcher = new ethers.Wallet("b7342c396b70f82fe04e4a891ded0b69187ebd0f7353e626bf0a8616614df2da", provider);
const jack = new ethers.Wallet("3bb16cc58c3652976ca221f25a9536d1cdd37615372db811119355f474649149", provider);

console.log(abi)
const CircleContract = new ethers.Contract(address,abi,provider);
const [value, setValue] = useState(null);

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
      props.getAddress(data[0].address)

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