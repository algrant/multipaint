export const genFifteenPuzzlePixelDex = (tileSize) => {
  // generates a 4x9 map

  /*

     1  2  3  4     2  8  3  6
     5  6  7  8     7 13 10 14
     9  10 11 12    1  9 12  4
    13  14 15 *     5 11 15  *

  */

  const shiftedSquares = [
    5, 11, 9, 15,
    14, 4, 2, 13,
    12, 8, 6, 10,
    7, 3, 1 ];

  const pixMatch = [];

  shiftedSquares.forEach((newTile, posId) => {
    const newId = newTile - 1;

    const oldX = (newId % 4)
    const oldY = (newId - oldX )/ 4;

    const newX = (posId % 4)
    const newY = (posId - newX )/ 4;

    for (let i = 0; i < tileSize; i++) {
      for (let j = 0; j < tileSize; j++) {
        pixMatch.push([
          [
            oldX*tileSize + i,
            oldY*tileSize + j
          ],
          [
            newX*tileSize + i + 5*tileSize,
            newY*tileSize + j
          ]
        ])
      }
    }
  });

  return pixMatch;
}

export const genFifteenPuzzleMaskedPixels = (tileSize) => {
  const maskedPixels = [];

  /* set opacity to 0 for in between spaces... */
  for(let x = 4*tileSize; x < 5*tileSize; x++) {
    for (let y = 0; y < 4*tileSize; y++) {
      maskedPixels.push([x, y]);
    }
  }

  /* set opacity to 0 for 15s */
  for(let x = 3*tileSize; x < 4*tileSize; x++) {
    for (let y = 3*tileSize; y < 4*tileSize; y++) {
      maskedPixels.push([x, y]);
      maskedPixels.push([x + 5*tileSize, y]);
    }
  }

  for (let x = 1; x < 9; x++) {
    for (let y = 0; y < 4*tileSize; y++) {
      maskedPixels.push([x*tileSize, y]);
    }
  }

  for (let x = 0; x < 9*tileSize; x++) {
    for (let y = 1; y < 4; y++) {
      maskedPixels.push([x, y*tileSize]);
    }
  }

  return maskedPixels;
}