const test = require("tape");
const { DIRECTION_RIGHT, DIRECTION_LEFT } = require("./constants");
const {
  isEqualArray,
  getCanScroll,
  getActiveItemScrollOffset,
  getScrollOffset,
} = require("./methods");

test("isEqualArray", function (t) {
  t.ok(isEqualArray(["1", "2"], ["1", "2"]));
  t.notOk(isEqualArray(["1", "3"], ["1", "2"]));

  const obj1 = {};
  const obj2 = {};

  t.ok(isEqualArray([obj1, obj2], [obj1, obj2]));
  t.notOk(isEqualArray([{}, {}], [{}, {}]));

  t.end();
});

test("getCanScroll", function (t) {
  t.ok(getCanScroll({ offsetWidth: 100 }, { scrollWidth: 101 }));
  t.notOk(getCanScroll({ offsetWidth: 100 }, { scrollWidth: 100 }));
  t.notOk(getCanScroll({ offsetWidth: 100 }, { scrollWidth: 99 }));
  t.end();
});

test("getActiveItemScrollOffset", function (t) {
  const listEl = {
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
  t.equal(getActiveItemScrollOffset(listEl, 0), -100);
  t.equal(getActiveItemScrollOffset(listEl, 1), -60);
  t.equal(getActiveItemScrollOffset(listEl, 2), 100);
  t.end();
});

test("getScrollOffset", function (t) {
  const containerEl = { offsetWidth: 100 };
  const listEl = { scrollLeft: 20 };
  const scrollStepSize = 0.1; // 10% of containerEl.offsetWidth

  t.equal(
    getScrollOffset(containerEl, listEl, DIRECTION_RIGHT, scrollStepSize),
    30
  );

  t.equal(
    getScrollOffset(containerEl, listEl, DIRECTION_LEFT, scrollStepSize),
    10
  );

  t.end();
});
