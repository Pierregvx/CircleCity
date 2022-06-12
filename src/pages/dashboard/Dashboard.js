import React, {useEffect, useState} from "react";
import styles from "./Dashboard.module.css";
import BurgerMenu from "../../components/BurgerMenu/BurgerMenu";
import Blockies from 'react-blockies';
import ActionButton from "../../components/ActionButton/ActionButton";
import StatLine from "../../components/StatLine/StatLine";
import HistoricCard from "../../components/HistoricCard/HistoricCard";
import Logo from "../../img/CircleCityImageTrans.png";
import axios from "axios";

const Dashboard = (props) => {

  const [actualBalance, setActualBalance] = useState("");
  const [name, setName] = useState("")

  useEffect(() => {
    setActualBalance("12.300")
  }, [])

  useEffect(() => {
    main();
  }, [])

  const main = async () => {
    const resultAxios = await axios.post('https://api.thegraph.com/subgraphs/id/QmWopUZTzWScTrNSvmMNUW93ZheeErwxjXDKKq8FzicYWe',
      {
        query: `
        {
          users(first: 5) {
           id 
           Funds
          }
        }
        `
      })
    console.log(resultAxios.data.data.users);
  }


  return (
    <div>
      <header className={styles.header}>
        <BurgerMenu/>
        <img src={Logo} alt="logo" width="120px"/>
        <Blockies
          seed="Canberra"
          size={13}
          scale={3}
          className={styles.blockies}
        />
      </header>

      <div className={styles.titleWrapper}>
        <h1>Hi, {props.address}</h1>
        <p>Welcome, Back!</p>
      </div>

      <div className={styles.amountWrapper}>
        <span className={styles.tokenName}>CCT</span>
        <p className={styles.actualBalance}>{actualBalance}</p>
        <p className={styles.balanceVariationWrapper}>
          <span className={styles.balanceColor}>1.150</span>
          <b className={styles.balanceVariation}>+10%</b>
        </p>
      </div>

      <div className={styles.actionWrapper}>
        <ActionButton text={"pay"}/>
      </div>

      <div className={styles.separator}/>

      <div className={styles.statsWrapper}>
        <h2>Your stats: </h2>

        <StatLine
          title={"Total earned"}
          value={"54.250 CCT"}
          growth={"+3.3%"}
          positive={true}
        />

        <StatLine
          title={"Total Carbon Footprint saved"}
          value={"222.5 Kg"}
          growth={"-2.3%"}
          positive={false}
        />

        <StatLine
          title={"Total kilometers traveled"}
          value={"1,343.5 Km"}
          growth={"+12.3Km"}
          positive={true}
        />
      </div>

      <div className={styles.separator}/>

      <div className={styles.statsWrapper}>
        <h2>Your Historic: </h2>
        <HistoricCard type={"bus"} amount={"+50"}/>
        <HistoricCard type={"scoot"} amount={"+150"}/>
        <HistoricCard type={"cart"} amount={"-300"}/>
        <HistoricCard type={"bus"} amount={"+500"}/>
        <HistoricCard type={"sub"} amount={"+30"}/>
        <HistoricCard type={"cart"} amount={"-150"}/>
      </div>

      <div className={styles.separator}/>

      <div className={styles.actionWrapper}>
        <ActionButton text={"Rewards"}/>
      </div>

      <footer className={styles.footer}/>

    </div>
  )
}

export default Dashboard;