import React, {useEffect, useState} from "react";
import styles from "./Dashboard.module.css";
import BurgerMenu from "../../components/BurgerMenu/BurgerMenu";
import Blockies from 'react-blockies';
import ActionButton from "../../components/ActionButton/ActionButton";
import StatLine from "../../components/StatLine/StatLine";
import HistoricCard from "../../components/HistoricCard/HistoricCard";
import Logo from "../../img/CircleCityImageTrans.png";
import axios from "axios";
import abi from "../../abi.json";
import {useNavigate} from "react-router-dom";

const {ethers} = require("ethers");
const address = "0x5a6A370ACe53e633c81034562aF79540a2cF5BCE";
const provider = new ethers.providers.JsonRpcProvider("https://eth-rinkeby.alchemyapi.io/v2/CKWiEfWIkOb2lvcXSBCllnUW-mj4dy7c")
const amount = 100;

const Dashboard = (props) => {

  const CircleContract = new ethers.Contract(address, abi, provider);
  const [actualBalance, setActualBalance] = useState("");
  const [name, setName] = useState("Jack");
  const [transactionValid, setTransactionValid] = useState(false);
  const [transactionAddress , setTransactionAddress] = useState("");
  const [reduction, setReduction] = useState(0);

  const user = new ethers.Wallet(props.privateKey, provider);
  const butcher = new ethers.Wallet("b7342c396b70f82fe04e4a891ded0b69187ebd0f7353e626bf0a8616614df2da", provider).address;
  useEffect(() => {
    main()
  }, [])

  const main = async () => {

    const resultAxios = await axios.post('https://api.thegraph.com/subgraphs/id/QmWopUZTzWScTrNSvmMNUW93ZheeErwxjXDKKq8FzicYWe',
      {
        query: `
        {
          user(id: "` + user.address.toLowerCase() + `" ) {
           id 
           Funds
          }
        }
        `
      })

    setActualBalance(resultAxios.data.data.user.Funds);

  }

  const payWithReduction = async () => {
    console.log(reduction);
    const tx = await CircleContract.connect(user).transferWithReduction(butcher, amount, reduction)
      .then((x) => x.wait());
    setTransactionValid(true);
    setTransactionAddress("https://rinkeby.etherscan.io/tx/" + tx.transactionHash);
  }

  const pay = async () => {
    const tx = await CircleContract.connect(user).transfer(butcher, amount)
      .then((x) => x.wait());
    setTransactionValid(true);
    setTransactionAddress("https://rinkeby.etherscan.io/tx/" + tx.transactionHash);

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
        <h1>Hi, {name}</h1>
        <p>Welcome, Back!</p>
      </div>

      <div className={styles.amountWrapper}>
        <span className={styles.tokenName}>CCT</span>
        <p className={styles.actualBalance}>{actualBalance}</p>
        <p className={styles.balanceVariationWrapper}>
          <span className={styles.balanceColor}>1.150</span>
        </p>
      </div>

      <div className={styles.actionWrapper}>
        <div className={styles.wrapper} onClick={() => reduction === 0 ? pay() : payWithReduction()}>
          <p>Reduction</p>
          <input type="number" onChange={(e) => setReduction(e.target.value)}/>
          <ActionButton text={"pay butcher 100"}/>
          {
            transactionValid ? <a className={styles.transactionLink} href={transactionAddress}>See transaction</a> : null
          }
        </div>

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