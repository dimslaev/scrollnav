const debounce = (fn, wait = 1) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.call(this, ...args), wait);
  };
};

const getCanScroll = (inner, outer) => {
  if (inner.scrollWidth <= outer.offsetWidth) {
    return "";
  }
  if (inner.scrollLeft === 0) {
    return "right";
  }
  if (Math.ceil(inner.scrollLeft) >= inner.scrollWidth - inner.offsetWidth) {
    return "left";
  }
  return "left,right";
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

  if (direction === "right") {
    distance = inner.scrollLeft + scrollSize;
  } else {
    distance = inner.scrollLeft - scrollSize;
  }

  return distance;
};

module.exports = {
  debounce,
  getCanScroll,
  getItemOffsetLeft,
  getScrollOffset,
};
