import React, { useState } from 'react'
import { CompactPicker } from 'react-color';
import "./BrushTool.css"


const hexToRGB = (hex) => {
  hex = '0x' + hex.slice(1,);
  let r = hex >> 16 & 0xFF
  let g = hex >> 8 & 0xFF
  let b = hex & 0xFF
  return [r, g, b];
}

// square brush with half width r
const SQUARE_BRUSH = "SQUARE_BRUSH";
const squareBrush = (r) => ({
  width: r*2 + 1,
  height: r*2 + 1,
  x_offset: -r,
  y_offset: -r,
  paint: () => true
});

export const genSquareBrush = (radius, colour) => {
  return {
    type: SQUARE_BRUSH,
    radius: radius,
    colour: colour,
    colourArray: hexToRGB(colour),
    brush: squareBrush(radius),
  }
};

// circle brush with radius r
const CIRCLE_BRUSH = "CIRCLE_BRUSH";
const circleBrush = (r) => ({
  width: r*2 + 1,
  height: r*2 + 1,
  x_offset: -r,
  y_offset: -r,
  paint: (i, j) => (i - r)*(i - r) + (j - r)*(j - r) < r*r
});

export const genCircleBrush = (radius, colour) => {
  return {
    type: CIRCLE_BRUSH,
    radius: radius,
    colour: colour,
    colourArray: hexToRGB(colour),
    brush: circleBrush(radius),
  }
};

const BrushPicker = ({ brush, setBrush }) => {
  const [show, setShow] = useState(true);

  const { colour, radius, type: brushType } = brush;

  const handleColourChange = (newColour) => { 
    console.log(newColour);
    if (brushType === CIRCLE_BRUSH) {
      setBrush(genCircleBrush(radius, newColour.hex));
    } else if (brushType === SQUARE_BRUSH) {
      setBrush(genSquareBrush(radius, newColour.hex));
    }
  };

  const handleChangeBrushType = (e) => {
    const newBrushType = e.target.value;
  
    if (newBrushType === CIRCLE_BRUSH) {
      setBrush(genCircleBrush(radius, colour));
    } else if (newBrushType === SQUARE_BRUSH) {
      setBrush(genSquareBrush(radius, colour));
    }
  }

  const handleRadiusChange = (e) => {
    const newRadius = e.target.value;

    if (brushType === CIRCLE_BRUSH) {
      setBrush(genCircleBrush(newRadius, colour));
    } else if (brushType === SQUARE_BRUSH) {
      setBrush(genSquareBrush(newRadius, colour));
    }
  };

  const handleClick = () => {
    setShow(!show);
  };

  return (
    <div className="BrushSetup">
      <div className="BrushView" onClick={handleClick}>
        <div className="BrushDisplay" style={{
          width: `${radius*2+1}px`,
          height: `${radius*2+1}px`,
          background: colour,
          borderRadius: brushType == SQUARE_BRUSH ? 0 : "50%",
        }} />
      </div>
      <div className="tooltip">
        <div>
          <div className="toolinput" onChange={ handleChangeBrushType }>
            <input type="radio" value={SQUARE_BRUSH} name="brushtype" checked={brushType === SQUARE_BRUSH}/> Square
            <input type="radio" value={CIRCLE_BRUSH} name="brushtype" checked={brushType === CIRCLE_BRUSH}/> Circle
          </div>
          <div>
            <input type="range" id="size" name="size"
                  min="0" max="50"   value={radius} onChange={handleRadiusChange}/>
            <label for="size">Size</label>
          </div>
        </div>


        <CompactPicker 
          color={colour} 
          onChangeComplete={ handleColourChange }
        />
      </div>
    </div>
  );
};



export default BrushPicker;