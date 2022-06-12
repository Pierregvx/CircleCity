import React from "react";
import styles from "./ActionButton.module.css";

const ActionButton = (props) => {

  return(
    <div className={styles.buttonWrapper}>
      <p>{props.text}</p>
    </div>
  )
}

export default ActionButton;