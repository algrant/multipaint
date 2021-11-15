import { genFifteenPuzzlePixelDex, genFifteenPuzzleMaskedPixels } from './15puzzleMap.js'

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

    genFifteenPuzzleMaskedPixels(512/4).forEach(([x, y]) => {
      const redPixel = (x + y*this.width)*4;
      this.imData[redPixel + 3] = 0;
    })
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
    const squareBrush = {
      width: r*2 + 1,
      height: r*2 + 1,
      x_offset: -r,
      y_offset: -r,
      paint: () => true
    }

    this.setBrushColour(x, y, squareBrush, colour);
  }
  
  setCircleColour(x, y, r, colour) {
    const circleBrush = {
      width: r*2 + 1,
      height: r*2 + 1,
      x_offset: -r,
      y_offset: -r,
      paint: (i, j) => (i - r)*(i - r) + (j - r)*(j - r) < r*r
    }

    this.setBrushColour(x, y, circleBrush, colour);
  }

  setBrushColour(x, y, brush, colour) {
    for(let i = 0; i < brush.width; i ++) {
      for (let j = 0; j < brush.height; j ++) {
        const pix_x = x + brush.x_offset + i;
        const pix_y = y + brush.y_offset + j;
        if (
          0 <= pix_x &&
          pix_x < this.width &&
          0 <= pix_y &&
          pix_y < this.height &&
          brush.paint(i, j)
        ) {
          this.setPixelColour(pix_x, pix_y, colour);
        }
      }
    }
  }

  fill(colour) {
    this.imData = this.imData.map((_, index) => colour[index%4]);
  }

}

export default MultiPaint;