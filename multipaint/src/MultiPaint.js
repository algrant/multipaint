class MultiPaint {
  constructor(height, width) {
    this.height = height;
    this.width = width;

    this.imData = new Uint8ClampedArray(width*height*4);
    this.fill([128, 128, 128, 256]);
    
    this.update = 0;
  }

  getPixelColour(x, y) {
    const redIndex = (x + this.width*y)*4;
    return this.imData.slice(redIndex, 4);
  }

  setPixelColour(x, y, colour) {
    const redIndex = (x + this.width*y)*4;
    this.imData.set(colour, redIndex);

    // not currently tied to anything, but so be it...
    this.update += 1;
  }

  setSquareColour(x, y, r, colour) {
    const x_min = Math.max(x - r, 0);
    const x_max = Math.min(x + r, this.width - 1);
    const y_min = Math.max(y - r, 0);
    const y_max = Math.min(y + r, this.width - 1);   
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