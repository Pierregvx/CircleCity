import React from "react";
import styles from "./StatLine.module.css";


const StatLine = (props) => {
  return(
    <div className={styles.statLineWrapper}>
      <h4>{props.title}</h4>
      <div>
        <p>{props.value}</p>
        <span className={props.positive ? styles.green : styles.red}>{props.growth}</span>
      </div>
    </div>
  )
}

export default StatLine;