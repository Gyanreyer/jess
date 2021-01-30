import { useEffect, useRef } from "react";
import styles from "./animatedBorder.module.scss";

export default function AnimatedBorder({
  isActive,
  borderColor,
  transitionDuration,
  borderWidth,
  className,
  children,
}) {
  const borderContainerRef = useRef();

  useEffect(() => {
    if (transitionDuration !== undefined)
      borderContainerRef.current.style.setProperty(
        "--transition-duration",
        `${transitionDuration}ms`
      );
    if (borderColor !== undefined)
      borderContainerRef.current.style.setProperty(
        "--border-color",
        borderColor
      );
    if (borderWidth !== undefined)
      borderContainerRef.current.style.setProperty(
        "--border-width",
        `${borderWidth}px`
      );
  }, [borderColor, borderWidth, transitionDuration]);

  return (
    <div
      className={`${styles.borderContainer} ${
        isActive ? styles.active : ""
      } ${className}`}
      style={{ transitionDuration, borderColor, borderWidth }}
      ref={borderContainerRef}
    >
      {children}
      <span className={`${styles.border} ${styles.top}`} />
      <span className={`${styles.border} ${styles.right}`} />
      <span className={`${styles.border} ${styles.bottom}`} />
      <span className={`${styles.border} ${styles.left}`} />
    </div>
  );
}
