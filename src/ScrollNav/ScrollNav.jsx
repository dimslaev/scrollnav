import React, { memo, forwardRef, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import SmoothScrollTo from "@dims/smooth-scroll-to";
import { ResizeObserver } from "resize-observer";
import { LeftArrowIcon, RightArrowIcon } from "./Icons";
import cn from "classnames";
import "./ScrollNav.scss";

import {
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
  DEFAULT_SCROLL_STEP_SIZE,
} from "./constants";

import { getItemOffsetLeft, getScrollOffset } from "./methods";

function ScrollNav({
  className,
  children,
  activeItemIndex = 0,
  scrollStepSize = DEFAULT_SCROLL_STEP_SIZE,
  leftArrowIcon,
  rightArrowIcon,
}) {
  const [canScroll, setCanScroll] = useState(false);
  const [lastScrollLeft, setLastScrollLeft] = useState(0);

  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const resizeObserver = useRef(null);
  const smoothScroll = useRef(null);

  const checkIfCanScroll = () => {
    setCanScroll(innerRef.current.scrollWidth > outerRef.current.offsetWidth);
  };

  const onScroll = () => {
    setLastScrollLeft((lastScrollLeft.current = innerRef.current.scrollLeft));
  };

  useEffect(() => {
    checkIfCanScroll();
  }, [children]);

  useEffect(() => {
    if (!outerRef.current) return;

    resizeObserver.current = new ResizeObserver(checkIfCanScroll);
    resizeObserver.current.observe(outerRef.current);

    return () => {
      resizeObserver.current.disconnect();
    };
  }, [outerRef.current]);

  useEffect(() => {
    if (!innerRef.current) return;

    smoothScroll.current = new SmoothScrollTo({
      target: innerRef.current,
      axis: "x",
      to: 0,
      duration: 150,
    });

    innerRef.current.addEventListener("scroll", onScroll);

    return () => {
      innerRef.current.removeEventListener("scroll", onScroll);
    };
  }, [innerRef.current]);

  useEffect(() => {
    scrollToActiveItem(activeItemIndex);
  }, [activeItemIndex]);

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

  let hideLeftArrow = false;
  let hideRightArrow = false;

  if (innerRef.current && outerRef.current) {
    hideLeftArrow = innerRef.current.scrollLeft === 0;
    hideRightArrow =
      Math.ceil(innerRef.current.scrollLeft) >=
      innerRef.current.scrollWidth - innerRef.current.offsetWidth;
  }

  const outerClasses = cn({
    scrollnav: true,
    [className]: typeof className === "string" && className.length > 0,
  });

  const buttonLeftClasses = cn({
    scrollnav__button: true,
    "scrollnav__button--left": true,
    "scrollnav__button--hidden": hideLeftArrow,
  });

  const buttonRightClasses = cn({
    scrollnav__button: true,
    "scrollnav__button--right": true,
    "scrollnav__button--hidden": hideRightArrow,
  });

  return (
    <nav className={outerClasses} ref={outerRef}>
      <Inner ref={innerRef} canScroll={canScroll}>
        {children}
      </Inner>

      <button
        className={buttonLeftClasses}
        onClick={onArrowClick(DIRECTION_LEFT)}
      >
        {leftArrowIcon || LeftArrowIcon}
      </button>

      <button
        className={buttonRightClasses}
        onClick={onArrowClick(DIRECTION_RIGHT)}
      >
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
};

ScrollNav.defaultProps = {
  scrollStepSize: DEFAULT_SCROLL_STEP_SIZE,
};

export default ScrollNav;
