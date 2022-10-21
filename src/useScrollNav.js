import { useState, useEffect, useRef } from "react";
import { useIsInitialRender } from "./useIsInitialRender";
import {
  getItemOffset,
  getTargetOffset,
  getCanScroll,
  applyStyles,
} from "./methods";

import SmoothScrollTo from "@dims/smooth-scroll-to";
import { ResizeObserver } from "resize-observer";

export const useScrollNav = ({
  listRef,
  scrollStepSize = 0.5,
  triggerUpdate = () => {},
}) => {
  const [canScroll, setCanScroll] = useState("prev,next");
  const isInitialRender = useIsInitialRender();
  const resizeObserver = useRef();
  const smoothScroll = useRef();

  const update = () => {
    if (!listRef.current) return;
    setCanScroll(getCanScroll(listRef.current));
  };

  useEffect(() => {
    if (!listRef.current) return;

    applyStyles(listRef.current);

    resizeObserver.current = new ResizeObserver(update);
    resizeObserver.current.observe(listRef.current);

    smoothScroll.current = new SmoothScrollTo({
      target: listRef.current,
      axis: "x",
      to: 0,
      duration: 150,
    });

    listRef.current.addEventListener("scroll", update);

    return () => {
      listRef.current.removeEventListener("scroll", update);
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

  const scrollPrev = () => {
    if (!listRef.current || !canScroll) return;

    scroll(getTargetOffset(listRef.current, "prev", scrollStepSize));
  };

  const scrollNext = () => {
    if (!listRef.current || !canScroll) return;

    scroll(getTargetOffset(listRef.current, "next", scrollStepSize));
  };

  const scrollToChildIndex = (index) => {
    if (!listRef.current || !canScroll || typeof index !== "number") {
      return;
    }

    scroll(getItemOffset(listRef.current, index));
  };

  return {
    canScrollPrev: canScroll.includes("prev"),
    canScrollNext: canScroll.includes("next"),
    scrollPrev,
    scrollNext,
    scrollToChildIndex,
  };
};
