const getCanScroll = (el) => {
  if (el.scrollWidth <= el.parentNode.offsetWidth) {
    return "";
  }
  if (el.scrollLeft === 0) {
    return "next";
  }
  if (Math.ceil(el.scrollLeft) >= el.scrollWidth - el.offsetWidth) {
    return "prev";
  }
  return "prev,next";
};

const getItemOffset = (el, index) => {
  const activeEl = el.childNodes[index];
  const prevEl = el.childNodes[index - 1];
  let targetEl = activeEl;

  if (prevEl) {
    if (el.offsetWidth > activeEl.offsetWidth + prevEl.offsetWidth) {
      targetEl = prevEl;
    }
  }

  return targetEl.offsetLeft - el.offsetLeft;
};

const getScrollOffset = (el, direction, scrollStepSize) => {
  const scrollSize = el.parentNode.offsetWidth * scrollStepSize;
  let distance = 0;

  if (direction === "next") {
    distance = el.scrollLeft + scrollSize;
  } else {
    distance = el.scrollLeft - scrollSize;
  }

  return distance;
};

const applyStyles = (el) => {
  el.className = "sn" + Date.now().toString(16);

  const style = document.createElement("style");
  document.head.appendChild(style);

  style.innerHTML = `
    .${el.className} {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      overflow: auto;
    }
    .${el.className}::-webkit-scrollbar {
      display: none;
    }
    .${el.className} > * {
      cursor: pointer;
      white-space: nowrap;
      user-select: none;
      position: relative;
    }
  `;
};

module.exports = {
  getCanScroll,
  getItemOffset,
  getScrollOffset,
  applyStyles,
};
