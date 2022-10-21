import React from "react";
import { useScrollNav } from "./useScrollNav";
import "./style.scss";

export const Example = () => {
  const [activeItemIndex, setActiveItemIndex] = React.useState(0);

  const navRef = React.useRef();

  const {
    canScrollLeft,
    canScrollRight,
    scrollLeft,
    scrollRight,
    scrollToChildIndex,
  } = useScrollNav({ navRef });

  const onItemClick = () => {
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

      <div className="preview">
        <nav ref={navRef}>
          {[...Array(8).keys()].map((_, i) => (
            <button onClick={onItemClick} data-index={i} key={`item-${i}`}>
              Item {i + 1}
            </button>
          ))}
        </nav>

        {canScrollLeft && (
          <button onClick={scrollLeft}>
            <LeftArrowIcon />
          </button>
        )}

        {canScrollRight && (
          <button onClick={scrollRight}>
            <RightArrowIcon />
          </button>
        )}
      </div>
    </main>
  );
};

export const LeftArrowIcon = () => (
  <svg
    width="7"
    height="12"
    viewBox="0 0 14 24"
    style={{ transform: "rotate(-180deg)" }}
  >
    <path
      fill="currentColor"
      d="M1.83 24L0 22L10 11.996L0 2L1.83 0L14 11.996L1.83 24Z"
    />
  </svg>
);

export const RightArrowIcon = () => (
  <svg width="7" height="12" viewBox="0 0 14 24">
    <path
      fill="currentColor"
      d="M1.83 24L0 22L10 11.996L0 2L1.83 0L14 11.996L1.83 24Z"
    />
  </svg>
);

export default Example;
