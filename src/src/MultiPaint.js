import {
  genFifteenPuzzlePixelDex,
  genFifteenPuzzleMaskedPixels,
} from "./15puzzleMap.js";
import { genInfinityCardData } from "./infinitycard";

// could support other polygons in future, for now just rectangles...
export const pixelsInBoundingBox = function* (polygon) {
  const minX = Math.min(...polygon.map(([_, x]) => x));
  const maxX = Math.max(...polygon.map(([_, x]) => x));
  const minY = Math.min(...polygon.map(([y, _]) => y));
  const maxY = Math.max(...polygon.map(([y, _]) => y));

  for (let x = minX; x < maxX; x++) {
    for (let y = minY; y < maxY; y++) {
      yield [y, x];
    }
  }
};

// only support translation for now.
export const applyTransform = (vec, { translate }) => {
  return [vec[0] + translate[0], vec[1] + translate[1]];
};

class MultiPaint {
  static demoTiles() {
    const tileWidth = 100;
    const { canvas, polygons } = genInfinityCardData(tileWidth);

    return this.fromCanvasAndTileData(canvas, polygons);
  }

  static fromCanvasAndTileData(canvas, tiles) {
    const mp = new MultiPaint();

    mp.height = canvas.height;
    mp.width = canvas.width;
    mp.imdata = new Uint8ClampedArray(mp.width * mp.height * 4);
    mp.fill([128, 128, 128, 256]);

    // initialize pixelDex
    mp.pixelDex = new Uint32Array(mp.width * mp.height);

    let pixId = 0;
    tiles.forEach(({ polygon, transforms }) => {
      [...pixelsInBoundingBox(polygon)].forEach((pixel) => {
        pixId += 1;
        transforms.forEach((transform) => {
          const tp = applyTransform(pixel, transform);
          const tpIndex = tp[0] + tp[1] * mp.width;
          mp.pixelDex[tpIndex] = pixId;
        });
      });
    });

    // set alpha for unindexed pixels
    mp.pixelDex.forEach((pixId, dex) => {
      if (pixId === 0) {
        // r,g,b,a -> alpha = dex*4
        mp.imdata[dex * 4] = 0;
      }
    });

    // initialize dexHash
    mp.dexHash = mp.pixelDex.reduce((memo, dex, i) => {
      if (dex === 0) return memo;
      memo[dex] = memo[dex] ? memo[dex] : [];
      memo[dex].push(i);
      return memo;
    }, {});
    mp.dexHash[0] = [];

    return mp;
  }

  static fromFifteenPuzzle(tileSize = 72) {
    const newMultiPaint = new MultiPaint();
    const height = tileSize * 4;
    const width = tileSize * 9;
    newMultiPaint.height = height;
    newMultiPaint.width = width;

    newMultiPaint.imdata = new Uint8ClampedArray(width * height * 4);
    newMultiPaint.fill([128, 128, 128, 256]);

    newMultiPaint.pixelDex = new Uint32Array(width * height);
    newMultiPaint.pixelDex = newMultiPaint.pixelDex.map((_, i) => i);
    const pixMatch = genFifteenPuzzlePixelDex(tileSize);

    pixMatch.forEach(([p1, p2]) => {
      const p1Dex = p1[0] + p1[1] * newMultiPaint.width;
      const p2Dex = p2[0] + p2[1] * newMultiPaint.width;
      newMultiPaint.pixelDex[p2Dex] = newMultiPaint.pixelDex[p1Dex];
    });

    newMultiPaint.dexHash = newMultiPaint.pixelDex.reduce((memo, dex, i) => {
      memo[dex] = memo[dex] ? memo[dex] : [];
      memo[dex].push(i);
      return memo;
    }, {});

    // set alpha to 0 for masking purposes
    genFifteenPuzzleMaskedPixels(tileSize).forEach(([x, y]) => {
      const redPixel = (x + y * newMultiPaint.width) * 4;
      newMultiPaint.imdata[redPixel + 3] = 0;
    });

    return newMultiPaint;
  }

  getPixelColour(x, y) {
    const redIndex = (x + this.width * y) * 4;
    return this.imdata.slice(redIndex, 4);
  }

  setPixelColour(x, y, colour) {
    const pixel = x + this.width * y;
    const dex = this.pixelDex[pixel];

    this.dexHash[dex].forEach((pixel) => {
      const redIndex = pixel * 4;
      this.imdata.set(colour, redIndex);
    });
  }

  paintPointBrushColour(x, y, brush, colour) {
    for (let i = 0; i < brush.width; i++) {
      for (let j = 0; j < brush.height; j++) {
        const pix_x = Math.floor(x) + brush.x_offset + i;
        const pix_y = Math.floor(y) + brush.y_offset + j;
        if (
          0 <= pix_x &&
          pix_x < this.width &&
          0 <= pix_y &&
          pix_y < this.height &&
          brush.paint_mask(i, j)
        ) {
          this.setPixelColour(pix_x, pix_y, colour);
        }
      }
    }
  }

  fill(colour) {
    this.imdata = this.imdata.map((_, index) => colour[index % 4]);
  }
}

export default MultiPaint;
