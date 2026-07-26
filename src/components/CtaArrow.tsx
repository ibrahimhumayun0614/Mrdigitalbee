import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import styles from "./CtaArrow.module.css";

type CtaArrowProps = {
  className?: string;
};

export default function CtaArrow({ className = "" }: CtaArrowProps) {
  return (
    <span className={`${styles.arrow} ${className}`.trim()} aria-hidden>
      <FontAwesomeIcon icon={faArrowRight} className={styles.icon} />
    </span>
  );
}
