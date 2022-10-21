import React from "react";
import { useScrollNav } from "./useScrollNav";
import "./style.scss";

export const Example = () => {
  const [activeItemIndex, setActiveItemIndex] = React.useState(0);

  const listRef = React.useRef();

  const {
    canScrollPrev,
    canScrollNext,
    scrollPrev,
    scrollNext,
    scrollToChildIndex,
  } = useScrollNav({ listRef });

  const onItemClick = (e) => {
    setActiveItemIndex(parseInt(e.target.dataset.index));
  };

  React.useEffect(() => {
    if (typeof activeItemIndex === "number") {
      scrollToChildIndex(activeItemIndex);
    }
  }, [activeItemIndex]);

  return (
    <main>
      <h1>ScrollNav</h1>

      <nav className="nav">
        <ul className="nav-list" ref={listRef}>
          {[...Array(8).keys()].map((_, i) => (
            <li
              key={`item-${i}`}
              className={`nav-list-item${
                i === activeItemIndex ? " active" : ""
              }`}
            >
              <button onClick={onItemClick} data-index={i}>
                Item {i + 1}
              </button>
            </li>
          ))}
        </ul>

        {canScrollPrev && (
          <button className="nav-control prev" onClick={scrollPrev}>
            <ArrowIcon style={{ transform: "rotate(-180deg)" }} />
          </button>
        )}

        {canScrollNext && (
          <button className="nav-control next" onClick={scrollNext}>
            <ArrowIcon />
          </button>
        )}
      </nav>
    </main>
  );
};

export const ArrowIcon = ({ style }) => (
  <svg width="7" height="12" viewBox="0 0 14 24" style={style}>
    <path
      fill="currentColor"
      d="M1.83 24L0 22L10 11.996L0 2L1.83 0L14 11.996L1.83 24Z"
    />
  </svg>
);

export default Example;
