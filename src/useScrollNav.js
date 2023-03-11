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

export const useScrollNav = (params = {}) => {
  const listRef = params.listRef || {};
  const scrollStepSize = params.scrollStepSize || 0.5;
  const triggerUpdate = params.triggerUpdate || false;

  const [canScroll, setCanScroll] = useState("");
  const isInitialRender = useIsInitialRender();
  const resizeObserver = useRef();
  const smoothScroll = useRef();

  const update = () => {
    if (!listRef.current) return;
    setCanScroll(getCanScroll(listRef.current));
  };

  useEffect(() => {
    if (!listRef || !listRef.current) {
      console.warn("listRef parameter is required");
      return;
    }

    if (!listRef.current.parentNode) {
      console.warn("listRef.current element must have a parentNode");
      return;
    }

    if (listRef.current.childNodes.length === 0) {
      console.warn("listRef.current element has no children");
      return;
    }

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
      listRef.current?.removeEventListener("scroll", update);
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
