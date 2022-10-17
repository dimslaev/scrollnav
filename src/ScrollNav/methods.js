const { DIRECTION_RIGHT } = require("./constants");

const isEqualArray = (arr1, arr2) => {
  return arr1.every((el, i) => el === arr2[i]);
};

const getItemOffsetLeft = (inner, index) => {
  const activeEl = inner.childNodes[index];
  const prevEl = inner.childNodes[index - 1];
  let targetEl = activeEl;

  if (prevEl) {
    if (inner.offsetWidth > activeEl.offsetWidth + prevEl.offsetWidth) {
      targetEl = prevEl;
    }
  }

  return targetEl.offsetLeft - inner.offsetLeft;
};

const getScrollOffset = (outer, inner, direction, scrollStepSize) => {
  const scrollSize = outer.offsetWidth * scrollStepSize;
  let distance = 0;

  if (direction === DIRECTION_RIGHT) {
    distance = inner.scrollLeft + scrollSize;
  } else {
    distance = inner.scrollLeft - scrollSize;
  }

  return distance;
};

module.exports = {
  isEqualArray,
  getItemOffsetLeft,
  getScrollOffset,
};
