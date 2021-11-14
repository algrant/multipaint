
const genFifteenPuzzlePixelDex = (tileSize) => {
  /*

     1  2  3  4         2  8  3  6
     5  6  7  8         7 13 10 14
     9  10 11 12        1  9 12  4
    13  14 15 *         5 11 15  *

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

class MultiPaint {
  constructor(height = 512, width = 9*512/4) {
    this.height = height;
    this.width = width;

    this.imData = new Uint8ClampedArray(width*height*4);
    this.fill([128, 128, 128, 256]);

    this.update = 0;

    this.pixelDex = new Uint32Array(width*height);
    // this.pixelDex = this.pixelDex.map((_, i) => (i%height + i/height)%(width/2));
    this.pixelDex = this.pixelDex.map((_, i) => i);
    
    const pixMatch = genFifteenPuzzlePixelDex(512/4);

    pixMatch.forEach(([p1, p2]) => {
      const p1Dex = p1[0] + p1[1]*this.width;
      const p2Dex = p2[0] + p2[1]*this.width;
      this.pixelDex[p2Dex] = this.pixelDex[p1Dex];
    });

    this.dexHash = this.pixelDex.reduce((memo, dex, i) => {
      memo[dex] = memo[dex] ? memo[dex] : [];
      memo[dex].push(i);
      return memo;
    }, {});

    /* set opacity to 0 for in between spaces... */
    for(let x = 512; x < 512 + 128; x++) {
      for (let y = 0; y < 512; y++) {
        const redPixel = (x + y*this.width)*4;
        this.imData[redPixel + 3] = 0;
      }
    }
    /* set opacity to 0 for 15s */
    for(let x = 512 - 128; x < 512; x++) {
      for (let y = 512 - 128; y < 512; y++) {
        const redPixel = (x + y*this.width)*4;
        this.imData[redPixel + 3] = 0;
        const redPixel2 = (x + y*this.width + 512 + 128)*4;
        this.imData[redPixel2 + 3] = 0;
      }
    }
  }

  getPixelColour(x, y) {
    const redIndex = (x + this.width*y)*4;
    return this.imData.slice(redIndex, 4);
  }

  setPixelColour(x, y, colour) {
    const pixel = x + this.width*y;
    const dex = this.pixelDex[pixel];

    this.dexHash[dex].forEach((pixel) => {
      const redIndex = pixel*4;
      this.imData.set(colour, redIndex);
    });

    // not currently tied to anything, but so be it...
    this.update += 1;
  }

  setSquareColour(x, y, r, colour) {
    const x_min = Math.max(x - r, 0);
    const x_max = Math.min(x + r, this.width - 1);
    const y_min = Math.max(y - r, 0);
    const y_max = Math.min(y + r, this.height - 1);   
    for(let i = x_min; i < x_max; i ++) {
      for (let j = y_min; j < y_max; j ++) {
        this.setPixelColour(i, j, colour);
      }
    }
  }

  fill(colour) {
    this.imData = this.imData.map((_, index) => colour[index%4]);
  }

}

export default MultiPaint;