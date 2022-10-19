import React, { memo, forwardRef, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import SmoothScrollTo from "@dims/smooth-scroll-to";
import { ResizeObserver } from "resize-observer";
import { LeftArrowIcon, RightArrowIcon } from "./Icons";
import cn from "classnames";
import "./ScrollNav.scss";

import { getItemOffsetLeft, getScrollOffset, getCanScroll } from "./methods";

const useIsInitialRender = () => {
  const ref = useRef();
  useEffect(() => {
    ref.current = true;
  }, []);
  return !ref.current;
};

function ScrollNav({
  className,
  children,
  activeItemIndex = 0,
  scrollStepSize = 0.5,
  leftArrowIcon,
  rightArrowIcon,
  triggerUpdate = false,
}) {
  const [canScroll, setCanScroll] = useState("left,right");
  const isInitialRender = useIsInitialRender();
  const outerRef = useRef();
  const innerRef = useRef();
  const resizeObserver = useRef();
  const smoothScroll = useRef();

  const update = () => {
    setCanScroll(getCanScroll(innerRef.current, outerRef.current));
  };

  useEffect(() => {
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
    scrollToActiveItem(activeItemIndex);
  }, [activeItemIndex]);

  useEffect(() => {
    if (!isInitialRender) update();
  }, [triggerUpdate]);

  const onArrowClick = (direction) => () => {
    smoothScroll.current.to = getScrollOffset(
      outerRef.current,
      innerRef.current,
      direction,
      scrollStepSize
    );

    smoothScroll.current.init();
  };

  const scrollToActiveItem = (index) => {
    if (!canScroll) return;
    smoothScroll.current.to = getItemOffsetLeft(innerRef.current, index);
    smoothScroll.current.init();
  };

  const outerClasses = cn({
    scrollnav: true,
    [className]: typeof className === "string" && className.length > 0,
  });

  const buttonLeftClasses = cn({
    scrollnav__button: true,
    "scrollnav__button--left": true,
    "scrollnav__button--hidden": !canScroll.includes("left"),
  });

  const buttonRightClasses = cn({
    scrollnav__button: true,
    "scrollnav__button--right": true,
    "scrollnav__button--hidden": !canScroll.includes("right"),
  });

  return (
    <nav className={outerClasses} ref={outerRef}>
      <Inner ref={innerRef} canScroll={canScroll}>
        {children}
      </Inner>

      <button className={buttonLeftClasses} onClick={onArrowClick("left")}>
        {leftArrowIcon || LeftArrowIcon}
      </button>

      <button className={buttonRightClasses} onClick={onArrowClick("right")}>
        {rightArrowIcon || RightArrowIcon}
      </button>
    </nav>
  );
}

const Inner = memo(
  forwardRef(({ children, canScroll }, ref) => {
    const innerClasses = cn({
      scrollnav__list: true,
      "scrollnav__list--scrollable": canScroll,
    });

    return (
      <ul className={innerClasses} ref={ref}>
        {children.map((item, index) => {
          return (
            <li
              key={`scrollnav-item-${index}`}
              className="scrollnav__list__item"
            >
              {item}
            </li>
          );
        })}
      </ul>
    );
  })
);

ScrollNav.propTypes = {
  className: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  scrollStepSize: PropTypes.number,
  activeItemIndex: PropTypes.number,
  triggerUpdate: PropTypes.bool,
};

export default ScrollNav;
