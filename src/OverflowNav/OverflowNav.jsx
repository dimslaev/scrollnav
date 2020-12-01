import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import Controls from "./components/Controls/Controls";
import ScrollBar from "./components/ScrollBar/ScrollBar";
import cn from "classnames";
import SmoothScrollTo from "@dims/smooth-scroll-to";
import "./OverflowNav.scss";

const MIN_SCROLL_STEP_SIZE = 0.1;
const DEFAULT_SCROLL_STEP_SIZE = 0.5;

class OverflowNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      canScroll: false,
      reachedScrollEnd: false,
      lastScrollLeft: 0,
      lastDirection: "next",
      navEl: null,
      navContentEl: null,
    };

    this.navRef = createRef();
    this.navContentRef = createRef();
  }

  componentDidMount() {
    const { navRef, navContentRef } = this;
    const navEl = navRef.current;
    const navContentEl = navContentRef.current;

    if (!navEl || !navContentEl) return;

    this.setState({ navEl, navContentEl }, () => {
      this.checkIfCanScroll();
      this.addListeners();
    });
  }

  componentWillUnmount() {
    const {
      state: { navEl, navContentEl },
    } = this;

    if (!navEl || !navContentEl) return;

    this.removeListeners();
  }

  render() {
    const {
      onScrollButtonClick,
      navRef,
      navContentRef,
      state: {
        canScroll,
        reachedScrollEnd,
        lastScrollLeft,
        lastDirection,
        navEl,
        navContentEl,
      },
      props: {
        children,
        className,
        scrollbarTrackColor,
        scrollbarThumbColor,
        buttonShadowColor,
        buttonArrowColor,
      },
    } = this;

    const navClasses = cn({
      "overflow-nav": true,
      [className]: typeof className === "string" && className.length > 0,
    });

    const contentClasses = cn({
      "overflow-nav__content": true,
      "overflow-nav__content--scrollable": canScroll,
    });

    const hideNextButton =
      !canScroll || (lastDirection === "next" && reachedScrollEnd);

    const hidePrevButton =
      !canScroll ||
      lastScrollLeft === 0 ||
      (lastDirection === "prev" && reachedScrollEnd);

    return (
      <nav className={navClasses} ref={navRef}>
        <div className={contentClasses} ref={navContentRef}>
          {children}
        </div>

        <ScrollBar
          hidden={!canScroll}
          navEl={navEl}
          navContentEl={navContentEl}
          scrollbarTrackColor={scrollbarTrackColor}
          scrollbarThumbColor={scrollbarThumbColor}
        />

        <Controls
          onScrollButtonClick={onScrollButtonClick}
          hidePrevButton={hidePrevButton}
          hideNextButton={hideNextButton}
          buttonShadowColor={buttonShadowColor}
          buttonArrowColor={buttonArrowColor}
        />
      </nav>
    );
  }

  addListeners = () => {
    const {
      state: { navContentEl },
    } = this;

    navContentEl.addEventListener("scroll", this.onScroll);
    window.addEventListener("resize", this.checkIfCanScroll);
  };

  removeListeners = () => {
    navContentEl.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("resize", this.checkIfCanScroll);
  };

  onScroll = () => {
    const {
      state: { navEl, navContentEl, lastScrollLeft },
    } = this;

    const { scrollLeft, scrollWidth } = navContentEl;
    const { offsetWidth } = navEl;
    const direction = lastScrollLeft < scrollLeft ? "next" : "prev";
    let reachedScrollEnd = false;

    if (direction === "next") {
      reachedScrollEnd = scrollLeft + offsetWidth >= scrollWidth;
    } else {
      reachedScrollEnd = scrollLeft === 0;
    }

    this.setState({
      reachedScrollEnd,
      lastScrollLeft: scrollLeft,
      lastDirection: direction,
    });
  };

  onNavItemClick = (index) => () => {
    const {
      props: { onItemClick },
    } = this;

    onItemClick(index);
  };

  onScrollButtonClick = (direction) => () => {
    const {
      state: { navEl, navContentEl },
      props: { scrollStepSize },
    } = this;

    const { scrollLeft } = navContentEl;
    const { offsetWidth } = navEl;
    const scrollSize = offsetWidth * scrollStepSize;

    const to =
      direction === "next" ? scrollLeft + scrollSize : scrollLeft - scrollSize;

    const scroll = new SmoothScrollTo({
      target: navContentEl,
      axis: "x",
      to,
      duration: 150,
    });
    scroll.init();
  };

  checkIfCanScroll = () => {
    const {
      state: { navEl, navContentEl },
    } = this;

    const containerWidth = navEl.offsetWidth;
    const scrollWidth = navContentEl.scrollWidth;

    this.setState({ canScroll: containerWidth < scrollWidth ? true : false });
  };
}

OverflowNav.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  className: PropTypes.string,
  scrollStepSize: function (props, propName) {
    if (props[propName] < MIN_SCROLL_STEP_SIZE) {
      return new Error(
        `scrollStepSize must be at least ${MIN_SCROLL_STEP_SIZE}.`
      );
    }
  },
  scrollbarTrackColor: PropTypes.string,
  scrollbarThumbColor: PropTypes.string,
  buttonShadowColor: PropTypes.string,
  buttonArrowColor: PropTypes.string,
};

OverflowNav.defaultProps = {
  scrollStepSize: DEFAULT_SCROLL_STEP_SIZE,
  scrollbarTrackColor: "#888",
  scrollbarThumbColor: "#555",
  buttonShadowColor: "#777",
  buttonArrowColor: "#fff",
};

export default OverflowNav;
