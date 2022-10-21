const test = require("tape");
const { getCanScroll, getItemOffset, getTargetOffset } = require("./methods");

test("getCanScroll", function (t) {
  const el = {
    parentNode: {
      offsetWidth: 30,
    },
    scrollWidth: 40,
    scrollLeft: 0,
  };

  t.equal(getCanScroll(el), "next");
  t.equal(getCanScroll({ ...el, scrollLeft: 5 }), "prev,next");
  t.equal(getCanScroll({ ...el, scrollLeft: 10 }), "prev");
  t.equal(getCanScroll({ ...el, scrollLeft: 9.5 }), "prev");
  t.equal(getCanScroll({ ...el, scrollWidth: 30 }), "");
  t.end();
});

test("getItemOffset", function (t) {
  const el = {
    offsetLeft: 100,
    childNodes: [
      {
        offsetWidth: 30,
        offsetLeft: 0,
      },
      {
        offsetWidth: 100,
        offsetLeft: 40,
      },
      {
        offsetWidth: 50,
        offsetLeft: 200,
      },
    ],
  };

  t.equal(getItemOffset(el, 0), -100);
  t.equal(getItemOffset(el, 1), -60);
  t.equal(getItemOffset(el, 2), 100);
  t.end();
});

test("getTargetOffset", function (t) {
  const el = { scrollLeft: 20, parentNode: { offsetWidth: 100 } };
  const scrollStepSize = 0.1; // 10% of parentNode.offsetWidth

  t.equal(getTargetOffset(el, "next", scrollStepSize), 30);
  t.equal(getTargetOffset(el, "prev", scrollStepSize), 10);
  t.end();
});
