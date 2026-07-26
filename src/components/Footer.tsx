import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.credit}>
          © {new Date().getFullYear()} | Developed by Muhammed
        </p>

        <a href="#home" className={styles.brand}>
          <img
            src="/logo.png"
            alt=""
            width={28}
            height={26}
            className={styles.brandMark}
          />
          <span>Mrdigital Bee</span>
        </a>
      </div>
    </footer>
  );
}
