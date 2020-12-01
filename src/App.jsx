import React, { Component } from "react";
import OverflowNav from "./OverflowNav/OverflowNav";
import cn from "classnames";
import "./style.scss";

const items = [
  "Item 1",
  "Item 2",
  "Item 3",
  "Item 4",
  "Item 5",
  "Item 6",
  "Item 7",
  "Item 8",
  "Item 9",
  "Item 10",
];

export class App extends Component {
  state = {
    activeIndex: 0,
  };

  onItemClick = (index) => () => {
    this.setState({ activeIndex: index });
  };

  render() {
    const {
      onItemClick,
      state: { activeIndex },
    } = this;

    return (
      <div className="container">
        <h1 className="title">OverflowNav</h1>

        <div className="preview">
          <OverflowNav
            className="custom-class"
            scrollStepSize={0.5}
            scrollbarTrackColor="#888"
            scrollbarThumbColor="#555"
            buttonShadowColor="#777"
            buttonArrowColor="#fff"
          >
            {items.map((item, index) => {
              const classes = cn({
                list__item: true,
                "list__item--active": index === activeIndex,
              });

              return (
                <div
                  key={`list-item-${index}`}
                  className={classes}
                  onClick={onItemClick(index)}
                >
                  {item}
                </div>
              );
            })}
          </OverflowNav>
        </div>
      </div>
    );
  }
}

export default App;
