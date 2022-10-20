import React, { memo, forwardRef, useEffect, useRef } from "react";
import { useScrollNav } from "./useScrollNav";
import PropTypes from "prop-types";
import { LeftArrowIcon, RightArrowIcon } from "./Icons";

function ScrollNav({
  className,
  children,
  activeItemIndex = 0,
  scrollStepSize = 0.5,
  leftArrowIcon,
  rightArrowIcon,
  triggerUpdate = false,
}) {
  const outerRef = useRef();
  const innerRef = useRef();

  const {
    canScrollLeft,
    canScrollRight,
    scrollLeft,
    scrollLRight,
    scrollToChildIndex,
  } = useScrollNav({
    outerRef,
    innerRef,
    scrollStepSize,
    triggerUpdate,
  });

  useEffect(() => {
    if (typeof activeItemIndex === "number" && children[activeItemIndex]) {
      scrollToChildIndex(activeItemIndex);
    }
  }, [activeItemIndex]);

  const leftButtonStyle = {
    ...buttonStyle,
    left: 0,
    visibility: !canScrollLeft ? "hidden" : "visible",
  };

  const rightButtonStyle = {
    ...buttonStyle,
    right: 0,
    visibility: !canScrollRight ? "hidden" : "visible",
  };

  return (
    <nav className={className} ref={outerRef} style={{ height: 40 }}>
      <Inner ref={innerRef}>{children}</Inner>

      <button style={leftButtonStyle} onClick={scrollLeft}>
        {leftArrowIcon || LeftArrowIcon}
      </button>

      <button style={rightButtonStyle} onClick={scrollLRight}>
        {rightArrowIcon || RightArrowIcon}
      </button>
    </nav>
  );
}

const Inner = memo(
  forwardRef(({ children }, ref) => {
    return (
      <ul ref={ref}>
        {children.map((item, index) => {
          return <li key={`scrollnav-item-${index}`}>{item}</li>;
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
