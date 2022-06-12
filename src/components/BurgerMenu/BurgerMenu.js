import styles from "./BurgerMenu.module.css";


const BurgerMenu = () => {

  return (
    <div className={styles.burgerWrapper}>
      <span className={styles.burgerSmall} />
      <span className={styles.burgerMedium}/>
      <span className={styles.burgerLarge}/>
    </div>
  )
}


export default BurgerMenu;