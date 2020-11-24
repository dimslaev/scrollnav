import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import SmoothScrollTo from "@dims/smooth-scroll-to";
import "./OverflowNav.scss";

const propTypes = {
  items: PropTypes.array.isRequired,
  activeIndex: PropTypes.number.isRequired,
  onItemClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

class OverflowNav extends Component {
  static propTypes = propTypes;

  constructor(props) {
    super(props);

    this.state = {
      canScroll: false,
      reachedScrollEnd: false,
      lastScrollLeft: 0,
      lastDirection: "asc",
      listEl: null,
      containerEl: null,
    };

    this.containerRef = createRef();
    this.listRef = createRef();
  }

  componentDidMount() {
    const { listRef, containerRef } = this;
    const listEl = listRef.current;
    const containerEl = containerRef.current;

    if (!listEl || !containerEl) return;

    this.setState({ listEl, containerEl }, () => {
      this.checkIfCanScroll();
      this.addListeners();
    });
  }

  componentWillUnmount() {
    const {
      state: { listEl, containerEl },
    } = this;

    if (!listEl || !containerEl) return;

    this.removeListeners();
  }

  render() {
    const {
      onNavItemClick,
      onScrollButtonClick,
      containerRef,
      listRef,
      state: { canScroll, reachedScrollEnd, lastScrollLeft, lastDirection },
      props: { activeIndex, items },
    } = this;

    const listClasses = cn({
      "overflow-nav__list": true,
      "overflow-nav__list--scrollable": canScroll,
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

    return (
      <nav className="overflow-nav" ref={containerRef}>
        <button
          className={buttonAscClasses}
          onClick={onScrollButtonClick("asc")}
        >
          <span className="overflow-nav__button__icon" />
        </button>

        <ul className={listClasses} ref={listRef}>
          {items.map((item, index) => {
            const classes = cn({
              "overflow-nav__list__item": true,
              "overflow-nav__list__item--active": index === activeIndex,
            });

            return (
              <li
                key={`overflow-nav-item-${index}`}
                className={classes}
                onClick={onNavItemClick(index)}
              >
                {item}
              </li>
            );
          })}
        </ul>

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
      state: { listEl },
    } = this;

    listEl.addEventListener("scroll", this.onScroll);
    window.addEventListener("resize", this.checkIfCanScroll);
  };

  removeListeners = () => {
    listEl.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("resize", this.checkIfCanScroll);
  };

  onScroll = () => {
    const {
      state: { containerEl, listEl, lastScrollLeft },
    } = this;

    const { scrollLeft, scrollWidth } = listEl;
    const { offsetWidth } = containerEl;
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
      state: { listEl, containerEl },
    } = this;

    const { scrollLeft } = listEl;
    const { offsetWidth } = containerEl;
    const offset = offsetWidth * 0.5;

    const to = direction === "asc" ? scrollLeft + offset : scrollLeft - offset;

    const scroll = new SmoothScrollTo({
      target: listEl,
      axis: "x",
      to,
      duration: 150,
    });
    scroll.init();
  };

  checkIfCanScroll = () => {
    const {
      state: { containerEl, listEl },
    } = this;

    const containerWidth = containerEl.offsetWidth;
    const scrollWidth = listEl.scrollWidth;

    this.setState({ canScroll: containerWidth < scrollWidth ? true : false });
  };
}

export default OverflowNav;
