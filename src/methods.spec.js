const test = require("tape");
const { getItemOffset, getScrollOffset } = require("./methods");

test("getItemOffset", function (t) {
  const inner = {
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
  t.equal(getItemOffset(inner, 0), -100);
  t.equal(getItemOffset(inner, 1), -60);
  t.equal(getItemOffset(inner, 2), 100);
  t.end();
});

test("getScrollOffset", function (t) {
  const outer = { offsetWidth: 100 };
  const inner = { scrollPrev: 20 };
  const scrollStepSize = 0.1; // 10% of outer.offsetWidth

  t.equal(getScrollOffset(outer, inner, "right", scrollStepSize), 30);

  t.equal(getScrollOffset(outer, inner, "left", scrollStepSize), 10);

  t.end();
});
