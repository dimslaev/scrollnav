import React, { useState } from "react";
import ScrollNav from "./ScrollNav/ScrollNav";
import cn from "classnames";
import "./style.scss";

export function App() {
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  function onItemClick(e) {
    setActiveItemIndex(parseInt(e.target.dataset.index));
  }

  return (
    <div className="container">
      <h1 className="title">ScrollNav</h1>

      <div className="preview">
        <ScrollNav
          className="nav"
          scrollStepSize={0.5}
          activeItemIndex={activeItemIndex}
        >
          {[...Array(8).keys()].map((_, i) => {
            const classes = cn({
              item: true,
              "item--active": i === activeItemIndex,
            });
            return (
              <button
                className={classes}
                data-index={i}
                onClick={onItemClick}
                key={`item-${i}`}
              >
                Item {i + 1}
              </button>
            );
          })}
        </ScrollNav>
      </div>
    </div>
  );
}

export default App;
