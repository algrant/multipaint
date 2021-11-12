# multipaint
react paint canvas app


# as simple as possible
let's directly use the canvas using pixels & the ImageData object
https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas

# general theory
let's make an multipaint class

data
 - img size 
    width*height < 2^32 (based on using the BigUint32Array for index data...)

 - img pixel data  
  - The Uint8ClampedArray contains [height × width × 4] bytes (8-bit unsigned integers) of data, with index values ranging from 0 to (height×width×4)-1.)
  -- Uint8ClampedArray

 - index data  BigUint32Array --  ( height x width ) 64-bit unsigned integers, index values from 0 to (height*width)-1.

functions
  - setPixelIndex(x, y, index)
    - directly sets index for pixel at x,y

  - setPixelColour(x, y, colour)
    - set all pixels sharing index at x,y to be this colour



