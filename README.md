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



# todo

# features
- colour selection
  - just front end

- brush selection
  - front end
  - update to multipaint class (needs more than just "setSquare")

- stroke input
  - front end -- capture mousedown, mousemove, mouseup
  - multipaint -- calculate necessary pixels along the path to apply brush

- layers in multipaint
  - ui
    - show brush outline rather than mouse & show it in all locations
    - display partial inputs - (i.e. for stroke input during move)
  - instead of 

- undo functionality
  - save all inputs
    - undo = rebuild from beginning using inputs up to now 
      --> could save some number of current "frames" every n inputs to make this faster...

  - save some number of generated images
    - undo = go back to previous frames

- save / load
  - use localstorage to save current image
  - come up an export / import strategy for this data (maybe just png?)

- zoom / pan
  - feels necessary, but not sure how to do it...


- move region mapping outside of the multipaint class




---- come up with answer for the non orthogonal rotation problem ----
- come up with a better region mapping plan to deal with rotations...
  - maintain an "original" region (in pixels)
  - for every pixel update via a brush we must
    - do transform to original region
    - transform to all other regions...

mapped regions are defined as
  - "original"
    - x, y, width, height, bitmask

    - "copies"
      - x, y, width, height, bitmask
        function to copy from original to new location
        function to copy from new location to original

every pixel can be at most part of one region
dealing with "borders" between regions feels difficult... (aliasing, etc...)


WHAT ABOUT SCALED UP VERSION SOMEWHERE?