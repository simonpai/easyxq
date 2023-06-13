export const UNAVAILABLE = 0xff;

export const BOARD_ARRAY_SIZE = 0x99; // 16 * 9 + 9

export const UP = 0x10;
export const DOWN = -0x10;
export const RIGHT = 0x01;
export const LEFT = -0x01;

export const UL = UP + LEFT;
export const UR = UP + RIGHT;
export const DL = DOWN + LEFT;
export const DR = DOWN + RIGHT;

export const U2L = (UP << 1) + LEFT;
export const U2R = (UP << 1) + RIGHT;
export const D2L = (DOWN << 1) + LEFT;
export const D2R = (DOWN << 1) + RIGHT;
export const L2U = (LEFT << 1) + UP;
export const L2D = (LEFT << 1) + DOWN;
export const R2U = (RIGHT << 1) + UP;
export const R2D = (RIGHT << 1) + DOWN;

export const U2L2 = UL << 1;
export const U2R2 = UR << 1;
export const D2L2 = DL << 1;
export const D2R2 = DR << 1;

export const INDICES = Object.freeze({
  *[Symbol.iterator]() {
    for (let rank = 0; rank < 10; rank++) {
      for (let index = rank << 4, bound = index + 9; index < bound; index++) {
        yield index;
      }
    }
  }
});

export function rank(sid) {
  return sid >> 4;
}

export function file(sid) {
  return sid & 0xf;
}

export function isUnavailable(sid) {
  return sid === UNAVAILABLE;
}

export function inBounds(sid) {
  return sid >= 0 && (sid & 0xf) < 9 && (sid >> 4) < 10;
}

export function validate(sid) {
  if (!inBounds(sid)) {
    throw new Error(`Square index out of bound: ${sid}`);
  }
  return sid;
}

const LAST_SID = BOARD_ARRAY_SIZE - 1;

export function mirror(sid) {
  return LAST_SID - sid;
}

export function* iterate(sid, step) {
  sid += step;
  while (inBounds(sid)) {
    yield sid;
    sid += step;
  }
}

export function next(sid) {
  return (sid & 0xf) < 8 ? sid + 1 : sid < LAST_SID ? (sid & 0xf0) + 0x10 : -1;
}

// special squares //
const PALACE_RED = Object.freeze(new Set([0x03, 0x04, 0x05, 0x13, 0x14, 0x15, 0x23, 0x24, 0x25]));

export const PALACE = Object.freeze({
  RED: PALACE_RED,
  BLACK: Object.freeze(new Set([...PALACE_RED].map(mirror))),
});

const ELEPHANTS_RED = Object.freeze(new Set([0x02, 0x06, 0x20, 0x24, 0x28, 0x42, 0x46]));

export const ELEPHANTS = Object.freeze({
  RED: ELEPHANTS_RED,
  BLACK: Object.freeze(new Set([...ELEPHANTS_RED].map(mirror))),
});

const PALACE_CORNERS_RED = Object.freeze(new Set([0x03, 0x05, 0x23, 0x25]));

export const PALACE_CORNERS = Object.freeze({
  RED: PALACE_CORNERS_RED,
  BLACK: Object.freeze(new Set([...PALACE_CORNERS_RED].map(mirror))),
});

// string //
export function format(sid) {
  return sid === UNAVAILABLE ? '--' : String.fromCharCode((sid & 0xf) + 97) + `${sid >> 4}`;
}

export function parse(notation) {
  if (notation.length === 2) {
    notation = notation.toLowerCase();
    const c0 = notation.charCodeAt(0); // a-i -> file
    const c1 = notation.charCodeAt(1); // 0-9 -> rank
    if (c0 > 96 && c0 < 106 && c1 >= 48 && c1 < 58) {
      return (c0 - 97) | ((c1 - 48) << 4);
    }
  }
  throw new Error(`Unrecognized coordinate notation: ${notation}`);
}
