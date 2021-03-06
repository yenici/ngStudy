export default {
  board: {
    size: 8,
    lines: 3,
    box: {
      margin: 0.25,
      color: 0x49281f,
      opacity: 1
    },
    square: {
      size: 1,
      height: 0.1,
      light: 0xe8d0aa,
      dark: 0xa67d5d,
      opacity: 0.9
    }
  },
  piece: {
    shape: {
      radius: 0.4,
      height: 0.2,
      segments: 50,
      z: 0.15
    },
    colors: {
      light: 0xfecd4d,
      dark: 0x6f4e45,
      active: 0xff7070,
      selected: 0xff0000,
      opacity: 0.95
    }
  }
};
