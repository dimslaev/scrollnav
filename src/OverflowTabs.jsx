import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import IconChevron from "./icon-chevron.svg";
import SmoothScrollTo from "./smoothScrollTo";
import "./OverflowTabs.scss";

const propTypes = {
  items: PropTypes.array.isRequired,
  activeIndex: PropTypes.number.isRequired,
  onItemClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

class OverflowTabs extends Component {
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

    return function cleanup() {
      this.removeListeners();
    };
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
      "overflow-tabs-nav__list": true,
      "overflow-tabs-nav__list--scrollable": canScroll,
    });

    const buttonAscClasses = cn({
      "overflow-tabs-nav__button": true,
      "overflow-tabs-nav__button--asc": true,
      "overflow-tabs-nav__button--hidden":
        !canScroll || (lastDirection === "asc" && reachedScrollEnd),
    });

    const buttonDescClasses = cn({
      "overflow-tabs-nav__button": true,
      "overflow-tabs-nav__button--desc": true,
      "overflow-tabs-nav__button--hidden":
        !canScroll ||
        lastScrollLeft === 0 ||
        (lastDirection === "desc" && reachedScrollEnd),
    });

    return (
      <nav className="overflow-tabs-nav" ref={containerRef}>
        <button
          className={buttonAscClasses}
          onClick={onScrollButtonClick("asc")}
        >
          <img className="overflow-tabs-nav__button__icon" src={IconChevron} />
        </button>

        <ul className={listClasses} ref={listRef}>
          {items.map((item, index) => {
            const classes = cn({
              "overflow-tabs-nav__list__item": true,
              "overflow-tabs-nav__list__item--active": index === activeIndex,
            });

            return (
              <li
                key={`overflow-tabs-nav-item-${index}`}
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
          <img className="overflow-tabs-nav__button__icon" src={IconChevron} />
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

export default OverflowTabs;
