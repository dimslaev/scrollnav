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
  navRef,
  scrollStepSize = 0.5,
  triggerUpdate = () => {},
}) => {
  const [canScroll, setCanScroll] = useState("left,right");
  const isInitialRender = useIsInitialRender();
  const resizeObserver = useRef();
  const smoothScroll = useRef();

  const update = () => {
    if (!navRef.current) return;
    setCanScroll(getCanScroll(navRef.current));
  };

  useEffect(() => {
    if (!navRef.current) return;

    applyStyles(navRef.current);

    resizeObserver.current = new ResizeObserver(update);
    resizeObserver.current.observe(navRef.current);

    smoothScroll.current = new SmoothScrollTo({
      target: navRef.current,
      axis: "x",
      to: 0,
      duration: 150,
    });

    navRef.current.addEventListener("scroll", update);

    return () => {
      navRef.current.removeEventListener("scroll", update);
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
    if (!navRef.current || !canScroll) return;

    scroll(getScrollOffset(navRef.current, "left", scrollStepSize));
  };

  const scrollRight = () => {
    if (!navRef.current || !canScroll) return;

    scroll(getScrollOffset(navRef.current, "right", scrollStepSize));
  };

  const scrollToChildIndex = (index) => {
    if (!navRef.current || !canScroll || typeof index !== "number") {
      return;
    }

    scroll(getItemOffsetLeft(navRef.current, index));
  };

  return {
    canScrollLeft: canScroll.includes("left"),
    canScrollRight: canScroll.includes("right"),
    scrollLeft,
    scrollRight,
    scrollToChildIndex,
  };
};
