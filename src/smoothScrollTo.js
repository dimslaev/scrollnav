const NAMESPACE = "SmoothScrollTo";
const DEFAULT_DURATION = 400;
const DIRECTION_ASC = "asc";
const DIRECTION_DESC = "desc";
const AXIS_X = "x";
const AXIS_Y = "y";
const EASE_LINEAR = "linear";
const EASE_OUT = "easeOut";
const EASE_IN = "easeIn";
const EASE_IN_OUT = "easeInOut";
const EASES = [EASE_LINEAR, EASE_OUT, EASE_IN, EASE_IN_OUT];
const EASINGS = {
  [EASE_LINEAR]: (t) => t,
  [EASE_OUT]: (t) => t * t,
  [EASE_IN]: (t) => t * (2 - t),
  [EASE_IN_OUT]: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
};

export default class SmoothScrollTo {
  constructor(options) {
    const {
      axis,
      callback,
      documentMock,
      duration,
      easing,
      target,
      to,
    } = options;

    this.axis = axis || AXIS_Y;
    this.callback = callback || function () {};
    this.document = documentMock || document;
    this.duration = duration || DEFAULT_DURATION;
    this.easing = easing || EASE_OUT;
    this.target = target || this.document.documentElement;
    this.to = to;
  }

  init() {
    this.validateOptions();

    this.startTime = performance.now();

    this.from = this.getFromCoordinate();
    this.to = this.getToCoordinate();
    this.direction = this.to > this.from ? DIRECTION_ASC : DIRECTION_DESC;
    this.distance = this.getDistance();

    this.easingFn = EASINGS[this.easing];

    this.hasBeenInterrupted = false;
    this.boundScrollStop = this.onScrollStop.bind(this);

    if (this.distance === 0) {
      console.warn(`${NAMESPACE}: no distance to be scrolled.`);
      return;
    }

    this.onScrollStart();
  }

  validateOptions() {
    if (this.axis !== AXIS_X && this.axis !== AXIS_Y) {
      throw new Error(`${NAMESPACE}: 'axis' must be either 'x' or 'y'.`);
    }

    if (typeof this.callback !== "function") {
      throw new Error(`${NAMESPACE}: 'callback' must be a function.`);
    }

    if (typeof this.duration !== "number") {
      throw new Error(`${NAMESPACE}: 'duration' must be a number.`);
    }

    if (!EASES.includes(this.easing)) {
      throw new Error(
        `${NAMESPACE}: 'easing' must be one of: ${EASES.join(", ")}.`
      );
    }

    if (typeof this.to !== "number") {
      throw new Error(`${NAMESPACE}: 'to' must be a number.`);
    }

    if (typeof this.target !== "object" || this.target === null) {
      throw new Error(
        `${NAMESPACE}: 'target' must be an object (DOM element).`
      );
    }
  }

  getFromCoordinate() {
    if (this.axis === AXIS_Y) {
      return this.target.scrollTop;
    } else {
      return this.target.scrollLeft;
    }
  }

  getToCoordinate() {
    if (this.axis === AXIS_Y) {
      return Math.max(
        Math.min(this.to, this.target.scrollHeight - this.target.clientHeight),
        0
      );
    } else {
      return Math.max(
        Math.min(this.to, this.target.scrollWidth - this.target.clientWidth),
        0
      );
    }
  }

  getDistance() {
    if (this.direction === DIRECTION_ASC) {
      return this.to - this.from;
    } else {
      return this.from - this.to;
    }
  }

  getProgressCoordinate(displacement) {
    if (this.direction === DIRECTION_ASC) {
      return this.from + displacement;
    } else {
      return this.from - displacement;
    }
  }

  addEventListeners() {
    this.target.addEventListener("mousewheel", this.boundScrollStop);
    this.target.addEventListener("touchmove", this.boundScrollStop);
  }

  removeEventListeners() {
    this.target.removeEventListener("mousewheel", this.boundScrollStop);
    this.target.removeEventListener("touchmove", this.boundScrollStop);
  }

  onScrollStart() {
    requestAnimationFrame(this.tick.bind(this));
    this.addEventListeners();
  }

  onScrollStop() {
    this.hasBeenInterrupted = true;
    this.removeEventListeners();
  }

  onScrollEnd() {
    this.callback();
    this.removeEventListeners();
  }

  scroll(coordinate) {
    if (this.axis === AXIS_Y) {
      this.target.scrollTop = coordinate;
    } else {
      this.target.scrollLeft = coordinate;
    }
  }

  tick() {
    if (this.hasBeenInterrupted) return;

    const elapsed = performance.now() - this.startTime;
    const progress = Math.min(elapsed / this.duration, 1);
    const displacement = this.easingFn(progress) * this.distance;
    const progressCoordinate = this.getProgressCoordinate(displacement);

    if (progress < 1) {
      this.scroll(progressCoordinate);
      requestAnimationFrame(this.tick.bind(this));
    } else {
      this.scroll(this.to);
      requestAnimationFrame(this.onScrollEnd.bind(this));
    }
  }
}
