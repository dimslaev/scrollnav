import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import "./Controls.scss";

class Controls extends Component {
  static propTypes = propTypes;

  render() {
    const {
      props: {
        hidePrevButton,
        hideNextButton,
        onScrollButtonClick,
        buttonShadowColor,
        buttonArrowColor,
      },
    } = this;

    const buttonPrevClasses = cn({
      "overflow-nav__button": true,
      "overflow-nav__button--prev": true,
      "overflow-nav__button--hidden": hidePrevButton,
    });

    const buttonNextClasses = cn({
      "overflow-nav__button": true,
      "overflow-nav__button--next": true,
      "overflow-nav__button--hidden": hideNextButton,
    });

    const buttonPrevStyles = {};
    const buttonNextStyles = {};

    if (typeof buttonShadowColor === "string" && buttonShadowColor.length > 0) {
      buttonPrevStyles.backgroundImage = `linear-gradient(
        -90deg,
        rgba(0, 0, 0, 0) 0%,
        ${buttonShadowColor} 60%
      )`;

      buttonNextStyles.backgroundImage = `linear-gradient(
        90deg,
        rgba(0, 0, 0, 0) 0%,
        ${buttonShadowColor} 60%
      )`;
    }

    return (
      <>
        <button
          className={buttonPrevClasses}
          style={buttonPrevStyles}
          onClick={onScrollButtonClick("prev")}
        >
          <svg className="overflow-nav__button__icon" viewBox="0 0 14 24">
            <path
              fill={buttonArrowColor}
              d="M1.83 24L0 22L10 11.996L0 2L1.83 0L14 11.996L1.83 24Z"
            />
          </svg>
        </button>

        <button
          className={buttonNextClasses}
          style={buttonNextStyles}
          onClick={onScrollButtonClick("next")}
        >
          <svg className="overflow-nav__button__icon" viewBox="0 0 14 24">
            <path
              fill={buttonArrowColor}
              d="M1.83 24L0 22L10 11.996L0 2L1.83 0L14 11.996L1.83 24Z"
            />
          </svg>
        </button>
      </>
    );
  }
}

Controls.propTypes = {
  hidePrevButton: PropTypes.bool.isRequired,
  hideNextButton: PropTypes.bool.isRequired,
  onScrollButtonClick: PropTypes.func.isRequired,
  buttonShadowColor: PropTypes.string,
  buttonArrowColor: PropTypes.string,
};

export default Controls;
