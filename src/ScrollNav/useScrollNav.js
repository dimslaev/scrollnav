import { useState, useEffect, useRef } from "react";
import { useIsInitialRender } from "./useIsInitialRender";
import {
  getItemOffsetLeft,
  getScrollOffset,
  getCanScroll,
  applyStyles,
} from "./methods";

import SmoothScrollTo from "@dims/smooth-scroll-to";
import { ResizeObserver } from "resize-observer";

export const useScrollNav = ({
  outerRef,
  innerRef,
  scrollStepSize = 0.5,
  triggerUpdate,
}) => {
  const [canScroll, setCanScroll] = useState("left,right");
  const isInitialRender = useIsInitialRender();
  const resizeObserver = useRef();
  const smoothScroll = useRef();

  const update = () => {
    if (!outerRef.current || !innerRef.current) return;
    setCanScroll(getCanScroll(outerRef.current, innerRef.current));
  };

  useEffect(() => {
    if (!outerRef.current || !innerRef.current) return;

    applyStyles(outerRef.current, innerRef.current);

    resizeObserver.current = new ResizeObserver(update);
    resizeObserver.current.observe(outerRef.current);

    smoothScroll.current = new SmoothScrollTo({
      target: innerRef.current,
      axis: "x",
      to: 0,
      duration: 150,
    });

    innerRef.current.addEventListener("scroll", update);

    return () => {
      innerRef.current.removeEventListener("scroll", update);
      resizeObserver.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isInitialRender) update();
  }, [triggerUpdate]);

  const scroll = (to) => {
    smoothScroll.current.to = to;
    smoothScroll.current.init();
  };

  const scrollLeft = () => {
    if (!outerRef.current || !innerRef.current || !canScroll) return;

    scroll(
      getScrollOffset(
        outerRef.current,
        innerRef.current,
        "left",
        scrollStepSize
      )
    );
  };

  const scrollLRight = () => {
    if (!outerRef.current || !innerRef.current || !canScroll) return;

    scroll(
      getScrollOffset(
        outerRef.current,
        innerRef.current,
        "right",
        scrollStepSize
      )
    );
  };

  const scrollToChildIndex = (index) => {
    if (
      !outerRef.current ||
      !innerRef.current ||
      !canScroll ||
      typeof index !== "number"
    ) {
      return;
    }

    scroll(getItemOffsetLeft(innerRef.current, index));
  };

  return {
    canScrollLeft: canScroll.includes("left"),
    canScrollRight: canScroll.includes("right"),
    scrollLeft,
    scrollLRight,
    scrollToChildIndex,
  };
};
