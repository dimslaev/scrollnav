import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import "./ScrollBar.scss";

const propTypes = {
  hidden: PropTypes.bool.isRequired,
  navEl: PropTypes.object,
  navContentEl: PropTypes.object,
  scrollbarTrackColor: PropTypes.string,
  scrollbarThumbColor: PropTypes.string,
};

class ScrollBar extends Component {
  static propTypes = propTypes;

  render() {
    const {
      props: {
        hidden,
        navEl,
        navContentEl,
        scrollbarTrackColor,
        scrollbarThumbColor,
      },
    } = this;

    if (!navEl || !navContentEl) return null;

    const scrollbarClasses = cn({
      "overflow-nav__scrollbar": true,
      "overflow-nav__scrollbar--hidden": hidden,
    });

    const scrollbarThumbClasses = cn({
      "overflow-nav__scrollbar__thumb": true,
    });

    const scrollbarTrackStyles = {};
    const scrollbarThumbStyles = {};

    if (
      typeof scrollbarTrackColor === "string" &&
      scrollbarTrackColor.length > 0
    ) {
      scrollbarTrackStyles.background = scrollbarTrackColor;
    }

    if (
      typeof scrollbarTrackColor === "string" &&
      scrollbarThumbColor.length > 0
    ) {
      scrollbarThumbStyles.background = scrollbarThumbColor;
    }

    const containerWidth = navEl.offsetWidth;
    const scrollWidth = navContentEl.scrollWidth;
    const ratio = containerWidth / scrollWidth;
    const thumbWidth = ratio * containerWidth;
    const thumbLeft = ratio * navContentEl.scrollLeft;

    scrollbarThumbStyles.width = thumbWidth;
    scrollbarThumbStyles.transform = `translateX(${thumbLeft}px)`;

    return (
      <div className={scrollbarClasses} style={scrollbarTrackStyles}>
        <div
          className={scrollbarThumbClasses}
          style={scrollbarThumbStyles}
        ></div>
      </div>
    );
  }
}

export default ScrollBar;
