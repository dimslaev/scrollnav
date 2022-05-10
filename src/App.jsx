import React, { Component } from "react";
import ScrollNav from "./ScrollNav/ScrollNav";
import cn from "classnames";
import "./style.scss";

export class App extends Component {
  state = {
    activeItemIndex: 0,
  };

  onItemClick = (index) => {
    this.setState({ activeItemIndex: index });
  };

  renderItems = () => {
    const {
      onItemClick,
      state: { activeItemIndex },
    } = this;

    return [...Array(8).keys()].map((_, i) => {
      const classes = cn({
        item: true,
        "item--active": i === activeItemIndex,
        "item--first": i === 0,
        "item--last": i === 7,
      });
      return (
        <button className={classes} onClick={() => onItemClick(i)}>
          Item {i + 1}
        </button>
      );
    });
  };

  render() {
    const {
      renderItems,
      state: { activeItemIndex },
    } = this;

    return (
      <div className="container">
        <h1 className="title">ScrollNav</h1>

        <div className="preview">
          <ScrollNav
            className="nav"
            scrollStepSize={0.5}
            items={renderItems()}
            activeItemIndex={activeItemIndex}
          />
        </div>
      </div>
    );
  }
}

export default App;
