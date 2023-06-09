const COLOR_BIT = 0x8;

export const EM = -1; // empty

export const RA = 0; // red advisor
export const RE = 1; // red elephant/bishop
export const RH = 2; // red horse/knight
export const RR = 3; // red chariot/rook
export const RC = 4; // red cannon
export const RK = 5; // red king
export const RP = 7; // red pawn

export const BA = RA | COLOR_BIT; // black advisor
export const BE = RE | COLOR_BIT; // black elephant/bishop
export const BH = RH | COLOR_BIT; // black horse/knight
export const BR = RR | COLOR_BIT; // black chariot/rook
export const BC = RC | COLOR_BIT; // black cannon
export const BK = RK | COLOR_BIT; // black king
export const BP = RP | COLOR_BIT; // black pawn
