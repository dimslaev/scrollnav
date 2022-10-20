const debounce = (fn, wait = 1) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.call(this, ...args), wait);
  };
};

const getCanScroll = (outer, inner) => {
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

const applyStyles = (outer, inner) => {
  outer.className = "scrollnav";
  inner.className = "scrollnav__inner";

  const style = document.createElement("style");
  document.head.appendChild(style);

  style.innerHTML = `
    .scrollnav {
      position: relative;
    }
    .scrollnav__inner {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      overflow: auto;
    }
    .scrollnav__inner::-webkit-scrollbar {
      display: none;
    }
    .scrollnav__inner > * {
      cursor: pointer;
      white-space: nowrap;
      user-select: none;
      position: relative;
    }
  `;
};

module.exports = {
  debounce,
  getCanScroll,
  getItemOffsetLeft,
  getScrollOffset,
  applyStyles,
};
