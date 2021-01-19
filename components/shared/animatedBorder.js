import { useMemo, useCallback, useRef, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import styles from "./animatedBorder.module.scss";

const ANIMATION_TRIGGER_MODES = {
  hover: "hover",
  scroll: "scroll",
};

export default function AnimatedBorder({
  animationTriggerMode = ANIMATION_TRIGGER_MODES.scroll,
  shouldRunOnce = true,
  borderColor,
  transitionDuration,
  borderWidth,
  hoverTargetOverrideRef = null,
  className,
  children,
}) {
  const hoverTargetRef = useRef();

  const intersectionObserverConfig = useMemo(
    () => ({
      triggerOnce: shouldRunOnce,
      // Only play the animation when 50% or more of the about section content is visible
      rootMargin: "-50%",
      // Disable the intersection observer if we're not using a scroll trigger mode
      skip: animationTriggerMode !== ANIMATION_TRIGGER_MODES.scroll,
    }),
    [animationTriggerMode, shouldRunOnce]
  );

  const [inViewRef, inView] = useInView(intersectionObserverConfig);

  const [isHovering, setIsHovering] = useState(false);

  const setRefs = useCallback(
    (node) => {
      // Ref's from useRef needs to have the node assigned to `current`
      hoverTargetRef.current = node;
      // Callback refs, like the one from `useInView`, is a function that takes the node as an argument
      inViewRef(node);
    },
    [inViewRef]
  );

  useEffect(() => {
    if (animationTriggerMode !== ANIMATION_TRIGGER_MODES.hover)
      return undefined;

    const onHover = () => {
      setIsHovering(true);
    };
    const onHoverOut = () => {
      if (!shouldRunOnce) setIsHovering(false);
    };

    const hoverTargetElement = hoverTargetOverrideRef
      ? hoverTargetOverrideRef.current
      : hoverTargetRef.current;

    hoverTargetElement.addEventListener("mouseenter", onHover);
    hoverTargetElement.addEventListener("focus", onHover);
    hoverTargetElement.addEventListener("mouseleave", onHoverOut);
    hoverTargetElement.addEventListener("blur", onHoverOut);

    return () => {
      hoverTargetElement.removeEventListener("mouseenter", onHover);
      hoverTargetElement.removeEventListener("focus", onHover);
      hoverTargetElement.removeEventListener("mouseleave", onHoverOut);
      hoverTargetElement.removeEventListener("blur", onHoverOut);
    };
  }, [animationTriggerMode, hoverTargetOverrideRef, shouldRunOnce]);

  useEffect(() => {
    const hoverTargetElement = hoverTargetOverrideRef
      ? hoverTargetOverrideRef.current
      : hoverTargetRef.current;

    if (transitionDuration) {
      hoverTargetElement.style.setProperty(
        "--transition-duration",
        transitionDuration
      );
    }

    if (borderColor) {
      hoverTargetElement.style.setProperty("--border-color", borderColor);
    }

    if (borderWidth) {
      hoverTargetElement.style.setProperty("--border-width", borderWidth);
    }
  }, [borderColor, borderWidth, hoverTargetOverrideRef, transitionDuration]);

  const isActive = isHovering || inView;

  return (
    <div
      className={`${styles.borderContainer} ${
        isActive ? styles.active : ""
      } ${className}`}
      ref={setRefs}
    >
      {children}
      <span className={`${styles.border} ${styles.top}`} />
      <span className={`${styles.border} ${styles.right}`} />
      <span className={`${styles.border} ${styles.bottom}`} />
      <span className={`${styles.border} ${styles.left}`} />
    </div>
  );
}
