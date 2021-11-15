export const genFifteenPuzzlePixelDex = (tileSize) => {
  // generates a 4x9 map

  /*

     1  2  3  4     2  8  3  6
     5  6  7  8     7 13 10 14
     9  10 11 12    1  9 12  4
    13  14 15 *     5 11 15  *

  */
  
  const shiftedSquares = [2, 8, 3, 6, 7, 13, 10, 14, 1, 9, 12, 4, 5, 11, 15];

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
  for(let x = 4*tileSize - 128; x < 4*tileSize; x++) {
    for (let y = 4*tileSize - 128; y < 4*tileSize; y++) {
      maskedPixels.push([x, y]);
      maskedPixels.push([x + 5*tileSize, y]);
    }
  }

  return maskedPixels;
}