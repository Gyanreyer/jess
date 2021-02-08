import { useEffect, useMemo, useRef } from "react";
import styles from "./animatedBorder.module.scss";

const animationOrderClasses = [
  styles.first,
  styles.second,
  styles.third,
  styles.fourth,
];

const borderEdgeClasses = [
  styles.top,
  styles.right,
  styles.bottom,
  styles.left,
];

export default function AnimatedBorder({
  isActive,
  borderColor,
  transitionDuration,
  borderWidth,
  className = "",
  children,
  startingEdge = "top",
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

  const startingEdgeIndex = useMemo(
    () => borderEdgeClasses.indexOf(styles[startingEdge]),
    [startingEdge]
  );

  return (
    <div
      className={`${styles.borderContainer} ${
        isActive ? styles.active : ""
      } ${className}`}
      style={{ transitionDuration, borderColor, borderWidth }}
      ref={borderContainerRef}
    >
      {children}
      {animationOrderClasses.map((orderClass, index) => (
        <span
          className={`${styles.border} ${orderClass} ${
            borderEdgeClasses[(startingEdgeIndex + index) % 4]
          }`}
        />
      ))}
    </div>
  );
}
