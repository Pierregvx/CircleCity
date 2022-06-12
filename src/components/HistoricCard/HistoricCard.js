import React from "react";
import styles from "./HistoricCard.module.css";
import Scoot from "../../img/scooter.png";
import Bus from "../../img/bus.png";
import Sub from "../../img/underground.png";
import Cart from "../../img/cart.png";


const HistoricCard = (props) => {

  return (
    <div className={styles.historicCard}>
      <div className={styles.headCard}>

        {
          props.type === "bus" &&
          <>
            <img src={Bus} alt="icon"/>
            <h4>Bus</h4>
          </>
        }

        {
          props.type === "scoot" &&
          <>
            <img src={Scoot} alt="icon"/>
            <h4>Scoot</h4>
          </>
        }

        {
          props.type === "sub" &&
          <>
            <img src={Sub} alt="icon"/>
            <h4>Subway</h4>
          </>
        }

        {
          props.type === "cart" &&
          <>
            <img src={Cart} alt="icon"/>
            <h4>Grocery</h4>
          </>
        }

      </div>
      <p><b>{props.amount}</b></p>
    </div>
  )
}

export default HistoricCard;