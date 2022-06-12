import React from "react";
import styles from "./Validation.module.css";
import {useNavigate} from "react-router-dom";


const Validation = () => {

  const navigate = useNavigate();

  return(
    <div className={styles.validationWrapper}>
      <h1>Your transactions has success</h1>
      <p onClick={() => navigate("../dashboard")}>Return dashboard</p>
    </div>
  )
}


export default Validation