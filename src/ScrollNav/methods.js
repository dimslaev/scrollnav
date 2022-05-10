const { DIRECTION_RIGHT } = require("./constants");

const isEqualArray = (arr1, arr2) => {
  return arr1.every((el, i) => el === arr2[i]);
};

const getCanScroll = (containerEl, listEl) => {
  return listEl.scrollWidth > containerEl.offsetWidth;
};

const getActiveItemScrollOffset = (listEl, activeItemIndex) => {
  const activeEl = listEl.childNodes[activeItemIndex];
  const prevEl = listEl.childNodes[activeItemIndex - 1];
  let targetEl = activeEl;

  if (prevEl) {
    if (listEl.offsetWidth > activeEl.offsetWidth + prevEl.offsetWidth) {
      targetEl = prevEl;
    }
  }

  return targetEl.offsetLeft - listEl.offsetLeft;
};

const getScrollOffset = (containerEl, listEl, direction, scrollStepSize) => {
  const scrollSize = containerEl.offsetWidth * scrollStepSize;

  let distance = 0;

  if (direction === DIRECTION_RIGHT) {
    distance = listEl.scrollLeft + scrollSize;
  } else {
    distance = listEl.scrollLeft - scrollSize;
  }

  return distance;
};

module.exports = {
  isEqualArray,
  getCanScroll,
  getActiveItemScrollOffset,
  getScrollOffset,
};
