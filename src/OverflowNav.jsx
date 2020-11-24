import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import SmoothScrollTo from "@dims/smooth-scroll-to";
import "./OverflowNav.scss";

const MIN_SCROLL_STEP_SIZE = 0.1;
const DEFAULT_SCROLL_STEP_SIZE = 0.5;

const propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  className: PropTypes.string,
  scrollStepSize: function (props, propName) {
    if (props[propName] < MIN_SCROLL_STEP_SIZE) {
      return new Error(
        `scrollStepSize must be at least ${MIN_SCROLL_STEP_SIZE}.`
      );
    }
  },
  colors: PropTypes.shape({
    scrollbarTrackColor: PropTypes.string,
    scrollbarThumbColor: PropTypes.string,
    buttonShadowColor: PropTypes.string,
    buttonArrowColor: PropTypes.string,
  }),
};

const defaultProps = {
  scrollStepSize: DEFAULT_SCROLL_STEP_SIZE,
  colors: {
    scrollbarTrackColor: "#999",
    scrollbarThumbColor: "#333",
    buttonShadowColor: "",
    buttonArrowColor: "",
  },
};

class OverflowNav extends Component {
  static propTypes = propTypes;

  static defaultProps = defaultProps;

  constructor(props) {
    super(props);

    this.state = {
      canScroll: false,
      reachedScrollEnd: false,
      lastScrollLeft: 0,
      lastDirection: "asc",
      navEl: null,
      navContentEl: null,
    };

    this.navRef = createRef();
    this.navContentRef = createRef();
    this.scrollbarRef = createRef();
    this.scrollbarThumbRef = createRef();
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
      scrollbarRef,
      scrollbarThumbRef,
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
        colors: {
          scrollbarTrackColor,
          scrollbarThumbColor,
          buttonShadowColor,
          buttonArrowColor,
        },
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

    const buttonAscClasses = cn({
      "overflow-nav__button": true,
      "overflow-nav__button--asc": true,
      "overflow-nav__button--hidden":
        !canScroll || (lastDirection === "asc" && reachedScrollEnd),
    });

    const buttonDescClasses = cn({
      "overflow-nav__button": true,
      "overflow-nav__button--desc": true,
      "overflow-nav__button--hidden":
        !canScroll ||
        lastScrollLeft === 0 ||
        (lastDirection === "desc" && reachedScrollEnd),
    });

    const scrollbarClasses = cn({
      "overflow-nav__scrollbar": true,
      "overflow-nav__scrollbar--hidden": !canScroll,
    });

    const scrollbarThumbClasses = cn({
      "overflow-nav__scrollbar__thumb": true,
    });

    const scrollbarTrackStyles = {};
    const scrollbarThumbStyles = {};

    if (scrollbarTrackColor.length > 0) {
      scrollbarTrackStyles.background = scrollbarTrackColor;
    }

    if (scrollbarThumbColor.length > 0) {
      scrollbarThumbStyles.background = scrollbarThumbColor;
    }

    if (navEl && navContentEl) {
      const containerWidth = navEl.offsetWidth;
      const scrollWidth = navContentEl.scrollWidth;
      const ratio = containerWidth / scrollWidth;
      const thumbWidth = ratio * containerWidth;
      const thumbLeft = ratio * navContentEl.scrollLeft;

      scrollbarThumbStyles.width = thumbWidth;
      scrollbarThumbStyles.transform = `translateX(${thumbLeft}px)`;
    }

    return (
      <nav className={navClasses} ref={navRef}>
        <button
          className={buttonAscClasses}
          onClick={onScrollButtonClick("asc")}
        >
          <span className="overflow-nav__button__icon" />
        </button>

        <div className={contentClasses} ref={navContentRef}>
          {children}
        </div>

        <div
          className={scrollbarClasses}
          ref={scrollbarRef}
          style={scrollbarTrackStyles}
        >
          <div
            className={scrollbarThumbClasses}
            ref={scrollbarThumbRef}
            style={scrollbarThumbStyles}
          ></div>
        </div>

        <button
          className={buttonDescClasses}
          onClick={onScrollButtonClick("desc")}
        >
          <span className="overflow-nav__button__icon" />
        </button>
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
    const direction = lastScrollLeft < scrollLeft ? "asc" : "desc";
    let reachedScrollEnd = false;

    if (direction === "asc") {
      // On iOS, sometimes the scroll end is not always detected
      // so an adjustment of 1px is needed.
      const iosMobileAdjustment = 1;
      reachedScrollEnd =
        scrollLeft + offsetWidth >= scrollWidth - iosMobileAdjustment;
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
      direction === "asc" ? scrollLeft + scrollSize : scrollLeft - scrollSize;

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

export default OverflowNav;
