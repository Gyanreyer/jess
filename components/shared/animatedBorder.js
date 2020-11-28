import { useMemo, useCallback, useRef, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { backgroundColor } from "../../constants/colors";

const ANIMATION_TRIGGER_MODES = {
  hover: "hover",
  scroll: "scroll",
};

export default function AnimatedBorder({
  animationTriggerMode = ANIMATION_TRIGGER_MODES.scroll,
  shouldRunOnce = true,
  borderColor = backgroundColor,
  transitionDuration = 800,
  borderWidth = "8px",
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

  const isActive = isHovering || inView;

  // Split the total transition duration so that the transition duration of all 4
  // border edges adds up to the total desired transition duration
  const edgeTransitionDuration = transitionDuration / 4;

  return (
    <div
      className={`border-container ${isActive ? "active " : ""}${className}`}
      ref={setRefs}
    >
      {children}
      <span className="border top" />
      <span className="border right" />
      <span className="border bottom" />
      <span className="border left" />
      <style jsx>{`
        .border-container {
          position: relative;
          padding: ${borderWidth};
        }

        .border {
          position: absolute;
          background-color: ${borderColor};
          transition: transform ${edgeTransitionDuration}ms;
        }

        .top,
        .bottom {
          /* Top and bottom edges extend all the way across the width of the box */
          left: 0;
          right: 0;
          height: ${borderWidth};

          /* Borders are squished down to 0 scale when hidden, then expand to full scale when active.
            To make this effect work, we will need to set each border's transform origin to the point that we want
            it to appear to expand from */
          transform: scaleX(0);
          .active & {
            transform: scaleX(1);
          }
        }

        .left,
        .right {
          /* Left and right edges extend all the way up and down the height of the box */
          top: 0;
          bottom: 0;
          width: ${borderWidth};

          transform: scaleY(0);
          .active & {
            transform: scaleY(1);
          }
        }

        .top {
          top: 0;
          transform-origin: left;
          transition-timing-function: ease-out;
          transition-delay: ${3 * edgeTransitionDuration}ms;

          .active & {
            /* This will be the first edge to transition in so it should ease in to make the whole animation appear smoother */
            transition-timing-function: ease-in;
            transition-delay: 0ms;
          }
        }
        .right {
          right: 0;
          transform-origin: top;
          transition-delay: ${2 * edgeTransitionDuration}ms;

          .active & {
            /* This is the 2nd edge to transition in so apply a delay to wait until the top edge is done transitioning */
            transition-delay: ${edgeTransitionDuration}ms;
          }
        }
        .bottom {
          bottom: 0;
          transform-origin: right;
          transition-delay: ${edgeTransitionDuration}ms;

          .active & {
            /* This is the 3rd edge to transition in so apply a delay to wait until the top and right edges are done transitioning */
            transition-delay: ${2 * edgeTransitionDuration}ms;
          }
        }
        .left {
          left: 0;
          transform-origin: bottom;
          transition-timing-function: ease-in;
          transition-delay: 0ms;

          .active & {
            /* This is the 4th edge to transition in so apply a delay to wait until all 3 other edges are done transitioning */
            transition-delay: ${3 * edgeTransitionDuration}ms;
            /* Because this is the last edge, apply an ease out to make the whole animation appear smoother */
            transition-timing-function: ease-out;
          }
        }
      `}</style>
    </div>
  );
}
