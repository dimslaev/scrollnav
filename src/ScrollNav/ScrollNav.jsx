import React, { Component } from "react";
import PropTypes from "prop-types";
import SmoothScrollTo from "@dims/smooth-scroll-to";
import { ResizeObserver } from "resize-observer";
import { ArrowIcon } from "./Icons";
import cn from "classnames";
import "./ScrollNav.scss";

import {
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
  DEFAULT_SCROLL_STEP_SIZE,
} from "./constants";

import {
  isEqualArray,
  getCanScroll,
  getActiveItemScrollOffset,
  getScrollOffset,
} from "./methods";

class ScrollNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      canScroll: false,
      lastScrollLeft: 0,
    };

    this.containerEl = null;
    this.listEl = null;
    this.resizeObserver = null;
    this.smoothScroll = null;
  }

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    this.unmount();
  }

  componentDidUpdate(prevProps) {
    const {
      props: { items, activeItemIndex },
    } = this;

    if (!isEqualArray(prevProps.items, items)) {
      this.checkIfCanScroll();
    }

    if (prevProps.activeItemIndex !== activeItemIndex) {
      this.scrollToActiveItem(activeItemIndex);
    }
  }

  render() {
    const {
      containerEl,
      listEl,
      onArrowClick,
      state: { canScroll },
      props: { items, className, arrowIcon },
    } = this;

    let hideLeftArrow = true;
    let hideRightArrow = true;

    if (listEl && containerEl) {
      hideLeftArrow = listEl.scrollLeft === 0;
      hideRightArrow =
        listEl.scrollLeft === listEl.scrollWidth - listEl.offsetWidth;
    }

    const containerClasses = cn({
      scrollnav: true,
      [className]: typeof className === "string" && className.length > 0,
    });

    const listClasses = cn({
      scrollnav__list: true,
      "scrollnav__list--scrollable": canScroll,
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
      <nav
        className={containerClasses}
        ref={(node) => {
          this.containerEl = node;
        }}
      >
        <ul
          className={listClasses}
          ref={(node) => {
            this.listEl = node;
          }}
        >
          {items.map((item, index) => {
            return (
              <li
                key={`scrollnav-list-item-${index}`}
                className="scrollnav__list__item"
              >
                {item}
              </li>
            );
          })}
        </ul>

        <button
          className={buttonLeftClasses}
          onClick={onArrowClick(DIRECTION_LEFT)}
        >
          {arrowIcon || ArrowIcon}
        </button>

        <button
          className={buttonRightClasses}
          onClick={onArrowClick(DIRECTION_RIGHT)}
        >
          {arrowIcon || ArrowIcon}
        </button>
      </nav>
    );
  }

  init = () => {
    const { containerEl, listEl } = this;

    this.resizeObserver = new ResizeObserver(this.checkIfCanScroll);
    this.resizeObserver.observe(containerEl);

    this.smoothScroll = new SmoothScrollTo({
      target: listEl,
      axis: "x",
      to: 0,
      duration: 150,
    });

    listEl.addEventListener("scroll", this.onScroll);

    this.checkIfCanScroll();
  };

  unmount = () => {
    const { listEl } = this;
    this.resizeObserver.disconnect();
    listEl.removeEventListener("scroll", this.onScroll);
  };

  onScroll = () => {
    const {
      listEl: { scrollLeft },
    } = this;

    this.setState({
      lastScrollLeft: scrollLeft,
    });
  };

  onArrowClick = (direction) => () => {
    const {
      containerEl,
      listEl,
      props: { scrollStepSize },
    } = this;

    this.smoothScroll.to = getScrollOffset(
      containerEl,
      listEl,
      direction,
      scrollStepSize
    );

    this.smoothScroll.init();
  };

  scrollToActiveItem = (index) => {
    const {
      state: { canScroll },
      listEl,
    } = this;

    if (!canScroll) return;

    this.smoothScroll.to = getActiveItemScrollOffset(listEl, index);
    this.smoothScroll.init();
  };

  checkIfCanScroll = () => {
    const { containerEl, listEl } = this;
    this.setState({ canScroll: getCanScroll(containerEl, listEl) });
  };
}

ScrollNav.propTypes = {
  className: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.node).isRequired,
  scrollStepSize: PropTypes.number,
  activeItemIndex: PropTypes.number,
};

ScrollNav.defaultProps = {
  scrollStepSize: DEFAULT_SCROLL_STEP_SIZE,
};

export default ScrollNav;
