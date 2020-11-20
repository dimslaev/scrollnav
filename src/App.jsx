import React, { Component } from "react";
import OverflowTabs from "./OverflowTabs";
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

  onItemClick = (index) => {
    this.setState({ activeIndex: index });
  };

  render() {
    const {
      onItemClick,
      state: { activeIndex },
    } = this;

    return (
      <div className="container">
        <h1 className="title">OverflowTabs</h1>

        <div className="preview">
          <OverflowTabs
            items={items}
            activeIndex={activeIndex}
            onItemClick={onItemClick}
            className="custom-class"
          />
        </div>
      </div>
    );
  }
}

export default App;
