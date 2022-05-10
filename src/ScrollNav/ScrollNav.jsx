import React, { Component } from "react";
import PropTypes from "prop-types";
import SmoothScrollTo from "@dims/smooth-scroll-to";
import { ResizeObserver } from "resize-observer";
import cn from "classnames";
import "./ScrollNav.scss";

export const DEFAULT_SCROLL_STEP_SIZE = 0.5;
export const DIRECTION_LEFT = "left";
export const DIRECTION_RIGHT = "right";

export const isEqualArray = (arr1, arr2) => {
  return arr1.some((el, i) => el !== arr2[i]);
};

export const ArrowIcon = (
  <svg width="7" height="12" viewBox="0 0 14 24">
    <path
      fill="currentColor"
      d="M1.83 24L0 22L10 11.996L0 2L1.83 0L14 11.996L1.83 24Z"
    />
  </svg>
);

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

    if (isEqualArray(prevProps.items, items)) {
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
      props: { items, activeItemIndex, className, arrowIcon },
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
            const classes = cn({
              scrollnav__list__item: true,
              "scrollnav__list__item--active": index === activeItemIndex,
            });

            return (
              <li key={`scrollnav-list-item${index}`} className={classes}>
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
    this.checkIfCanScroll();

    this.resizeObserver = new ResizeObserver(this.checkIfCanScroll);
    this.resizeObserver.observe(containerEl);

    this.smoothScroll = new SmoothScrollTo({
      target: listEl,
      axis: "x",
      to: 0,
      duration: 150,
    });

    listEl.addEventListener("scroll", this.onScroll);
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

    const { scrollLeft } = listEl;
    const { offsetWidth } = containerEl;
    const scrollSize = offsetWidth * scrollStepSize;

    this.smoothScroll.to =
      direction === DIRECTION_RIGHT
        ? scrollLeft + scrollSize
        : scrollLeft - scrollSize;
    this.smoothScroll.init();
  };

  scrollToActiveItem = (index) => {
    const {
      state: { canScroll },
      listEl,
    } = this;

    if (!canScroll) return;

    const activeEl = listEl.childNodes[index];
    const prevEl = listEl.childNodes[index - 1];
    let targetEl = activeEl;

    if (prevEl) {
      if (listEl.offsetWidth > activeEl.offsetWidth + prevEl.offsetWidth) {
        targetEl = prevEl;
      }
    }

    this.smoothScroll.to = targetEl.offsetLeft - listEl.offsetLeft;
    this.smoothScroll.init();
  };

  checkIfCanScroll = () => {
    const { containerEl, listEl } = this;
    const containerWidth = containerEl.offsetWidth;
    const scrollWidth = listEl.scrollWidth;
    this.setState({ canScroll: containerWidth < scrollWidth ? true : false });
  };
}

ScrollNav.propTypes = {
  className: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.node).isRequired,
  scrollStepSize: function (props, propName) {
    if (props[propName] < MIN_SCROLL_STEP_SIZE) {
      return new Error(
        `scrollStepSize must be at least ${MIN_SCROLL_STEP_SIZE}.`
      );
    }
  },
  activeItemIndex: PropTypes.number,
};

ScrollNav.defaultProps = {
  scrollStepSize: DEFAULT_SCROLL_STEP_SIZE,
};

export default ScrollNav;
